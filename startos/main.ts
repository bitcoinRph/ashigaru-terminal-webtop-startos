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
  // silently inside Ashigaru (hung connections, unresponsive UI). The check is
  // staged so the message says *why* it failed: tor.startos only resolves while
  // the Tor service is installed and running (fresh StartOS installs do not
  // include it), and a resolving name with a closed port means the Tor service
  // itself is unhealthy.
  if (
    (store?.manageSettings ?? true) &&
    (store?.proxyType ?? 'tor') === 'tor'
  ) {
    return daemons.addHealthCheck('tor-proxy', {
      ready: {
        display: i18n('Tor Proxy'),
        fn: async () => {
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

          const tcp = await appSub.exec(
            [
              '/usr/bin/socat',
              '-T',
              '5',
              '/dev/null',
              `TCP:${torHost}:${torSocksPort},connect-timeout=5`,
            ],
            undefined,
            15_000,
          )
          if (tcp.exitCode !== 0) {
            return {
              result: 'failure' as const,
              message: i18n(
                'The Tor service is installed but its SOCKS proxy port is not reachable. Check that the Tor service is running and healthy.',
              ),
            }
          }

          return {
            result: 'success' as const,
            message: i18n('The Tor SOCKS proxy is reachable'),
          }
        },
      },
      requires: [],
    })
  }

  return daemons
})
