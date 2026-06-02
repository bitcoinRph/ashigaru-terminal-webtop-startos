import { sdk } from './sdk'
import { storeJson } from './fileModels/store.json'

// Require the relevant backend service to be running based on the user's
// selected server type. 'public' and an unset store require nothing.
export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const serverType = await storeJson.read((s) => s.serverType).const(effects)

  if (serverType === 'bitcoind') {
    return {
      bitcoind: {
        kind: 'running',
        versionRange: '>=0.21.1.2:0',
        healthChecks: [],
      },
    }
  }

  if (serverType === 'electrs') {
    return {
      electrs: {
        kind: 'running',
        versionRange: '>=0.9.6:0',
        healthChecks: [],
      },
    }
  }

  return {}
})
