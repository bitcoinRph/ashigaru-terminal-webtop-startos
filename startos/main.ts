import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  uiPort,
  bitcoindHost,
  electrsHost,
  torHost,
  torSocksPort,
} from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  // Read the persisted Webtop credentials and Ashigaru settings. A change to
  // any of these re-runs setupMain, restarting the desktop with new values.
  const store = await storeJson.read((s) => s).const(effects)

  // The Webtop home directory lives on the 'userdir' volume, mounted at /config.
  const appSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'main' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'userdir',
      subpath: null,
      mountpoint: '/config',
      readonly: false,
    }),
    'ashigaru-webtop-sub',
  )

  // docker_entrypoint.sh and the Webtop base image consume these. We
  // intentionally do NOT set CUSTOM_USER/PASSWORD: leaving PASSWORD unset
  // disables the image's nginx basic auth, so the Web UI opens directly and
  // access is gated by StartOS (Tor/LAN + StartOS auth) instead.
  const env: Record<string, string> = {
    PUID: '1000',
    PGID: '1000',
    TZ: 'Etc/UTC',
    TITLE: store?.title ?? 'Ashigaru Terminal',
    RECONNECT: String(store?.reconnect ?? false),
    MANAGE_SETTINGS: String(store?.manageSettings ?? true),
    SERVER_TYPE: store?.serverType ?? 'electrs',
    PROXY_TYPE: store?.proxyType ?? 'tor',
    BITCOIND_RPC_USER: store?.bitcoindRpcUser ?? '',
    BITCOIND_RPC_PASS: store?.bitcoindRpcPassword ?? '',
    BITCOIND_HOST: bitcoindHost,
    ELECTRS_HOST: electrsHost,
    TOR_PROXY: `${torHost}:${torSocksPort}`,
    // JavaFX's GTK backend consumes pointer input via XInput2, which KasmVNC
    // does not deliver correctly: the cursor moves but clicks are dropped, so
    // the wallet is unusable by mouse. Forcing GDK to legacy core X pointer
    // events fixes clicking. Also set in startwm.sh; kept here so it is present
    // no matter how the desktop session is started.
    GDK_CORE_DEVICE_EVENTS: '1',
  }

  const daemons = sdk.Daemons.of(effects).addDaemon('webui', {
    subcontainer: appSub,
    exec: {
      command: ['/usr/local/bin/docker_entrypoint.sh'],
      env,
      // The Webtop base image uses s6-overlay (/init), which refuses to run
      // unless it is PID 1. Run our entrypoint as the container init so its
      // `exec /init` becomes PID 1 and s6 can start the desktop services.
      runAsInit: true,
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })

  // When StartOS manages settings and Tor is selected, surface the Tor SOCKS
  // proxy's reachability on the dashboard. An unreachable proxy otherwise fails
  // silently inside Ashigaru (hung connections, unresponsive UI).
  //
  // The check opens a real TCP connection to tor.startos:9050 first, because
  // that is exactly what Ashigaru does and is the only signal that actually
  // matters. We deliberately do NOT gate on a DNS lookup first: name
  // resolution and TCP routing can disagree (e.g. NSS/getent behaving
  // differently from the container's actual route to the Tor service), and an
  // earlier version that probed DNS first could report "Tor not found" even
  // though the proxy was reachable. A successful connect succeeds as soon as
  // Tor is listening (even mid-bootstrap), and nothing else listens on that
  // host:port, so a successful connect means the proxy is usable. Absolute
  // binary paths are used because health-check commands run via
  // `start-container exec` with the image env-file, where a bare `socat` may
  // not resolve on PATH and would fail spuriously.
  //
  // If tor.startos:9050 does not answer, we also try the container gateway
  // (where older StartOS exposed the host Tor) before declaring failure, and we
  // log the exact connect error so a Tor-side problem is diagnosable from the
  // service logs alone. Only when no path answers do we consult DNS, and then
  // only to explain *why*: tor.startos resolves only while the Tor service is
  // installed and running (fresh StartOS installs do not include it), so a
  // resolution failure means the service is missing, whereas a resolving name
  // with a closed port means the Tor service itself is unreachable/unhealthy.
  if (
    (store?.manageSettings ?? true) &&
    (store?.proxyType ?? 'tor') === 'tor'
  ) {
    return daemons.addHealthCheck('tor-proxy', {
      ready: {
        display: i18n('Tor Proxy'),
        fn: async () => {
          // TCP-connect probe of a `host:port` SOCKS endpoint.
          const probe = (target: string) =>
            appSub.exec(
              [
                '/usr/bin/socat',
                '-T',
                '5',
                '/dev/null',
                `TCP:${target},connect-timeout=5`,
              ],
              undefined,
              15_000,
            )

          // 1) The StartOS 'tor' package at tor.startos:9050 (normal case).
          const primary = await probe(`${torHost}:${torSocksPort}`)
          if (primary.exitCode === 0) {
            return {
              result: 'success' as const,
              message: i18n('The Tor SOCKS proxy is reachable'),
            }
          }
          // Surface the *exact* reason (refused vs. timeout vs. no route) in the
          // service logs — invaluable when the failure is on the Tor side and
          // there is no shell on the box.
          console.error(
            `[tor-proxy] connect to ${torHost}:${torSocksPort} failed: ${primary.stderr
              ?.toString()
              .trim()}`,
          )

          // 2) Fallback: older StartOS exposed the host Tor SOCKS proxy on the
          // container's network gateway. If the package path is broken but the
          // gateway answers, the proxy is still usable (docker_entrypoint.sh
          // performs the same selection for the wallet itself).
          const gw = await appSub.exec(
            [
              '/bin/sh',
              '-c',
              "ip -4 route list match 0/0 2>/dev/null | awk '{print $3; exit}'",
            ],
            undefined,
            10_000,
          )
          const gwIp = gw.stdout?.toString().trim()
          if (gwIp) {
            const viaGw = await probe(`${gwIp}:${torSocksPort}`)
            console.error(
              `[tor-proxy] gateway ${gwIp}:${torSocksPort} connect exit=${viaGw.exitCode}`,
            )
            if (viaGw.exitCode === 0) {
              return {
                result: 'success' as const,
                message: i18n('The Tor SOCKS proxy is reachable'),
              }
            }
          }

          // 3) Neither path answered — explain why using DNS resolution.
          const dns = await appSub.exec(
            ['/usr/bin/getent', 'hosts', torHost],
            undefined,
            10_000,
          )
          if (dns.exitCode !== 0) {
            return {
              result: 'failure' as const,
              message: i18n(
                'The Tor service was not found on your StartOS server. Install it from the Marketplace and start it, or set the proxy to None in "Configure Ashigaru Terminal".',
              ),
            }
          }

          return {
            result: 'failure' as const,
            message: i18n(
              'The Tor service is installed but its SOCKS proxy port is not reachable. Check that the Tor service is running and healthy.',
            ),
          }
        },
      },
      requires: [],
    })
  }

  return daemons
})
