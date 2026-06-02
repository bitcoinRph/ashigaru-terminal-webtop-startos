import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort, bitcoindHost, electrsHost } from './utils'
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

  // docker_entrypoint.sh consumes these to configure the Webtop login and,
  // when MANAGE_SETTINGS is true, Ashigaru's server/proxy settings.
  const env: Record<string, string> = {
    PUID: '1000',
    PGID: '1000',
    TZ: 'Etc/UTC',
    CUSTOM_USER: store?.username ?? 'webtop',
    PASSWORD: store?.password ?? '',
    TITLE: store?.title ?? 'Ashigaru Terminal',
    RECONNECT: String(store?.reconnect ?? false),
    MANAGE_SETTINGS: String(store?.manageSettings ?? true),
    SERVER_TYPE: store?.serverType ?? 'electrs',
    PROXY_TYPE: store?.proxyType ?? 'tor',
    BITCOIND_RPC_USER: store?.bitcoindRpcUser ?? '',
    BITCOIND_RPC_PASS: store?.bitcoindRpcPassword ?? '',
    BITCOIND_HOST: bitcoindHost,
    ELECTRS_HOST: electrsHost,
  }

  return sdk.Daemons.of(effects).addDaemon('webui', {
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
})
