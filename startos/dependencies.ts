import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'

// Require the backend and proxy services matching the user's configuration.
// These only apply while StartOS manages Ashigaru's settings — when the user
// manages them in-app, we can't know what the app actually connects to.
// 'public' and an unset store require nothing.
export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const store = await storeJson.read((s) => s).const(effects)

  if (!(store?.manageSettings ?? true)) return {}

  return {
    ...(store?.serverType === 'bitcoind'
      ? {
          bitcoind: {
            kind: 'running' as const,
            versionRange: '>=0.21.1.2:0',
            healthChecks: [],
          },
        }
      : {}),
    ...((store?.serverType ?? 'electrs') === 'electrs'
      ? {
          electrs: {
            kind: 'running' as const,
            versionRange: '>=0.9.6:0',
            healthChecks: [],
          },
        }
      : {}),
    ...((store?.proxyType ?? 'tor') === 'tor'
      ? {
          tor: {
            kind: 'running' as const,
            versionRange: '*',
            healthChecks: [],
          },
        }
      : {}),
  }
})
