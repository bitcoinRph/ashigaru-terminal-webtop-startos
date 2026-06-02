import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  // Seed sensible defaults. These can be changed later via the
  // "Configure Ashigaru Terminal" action. There are no Webtop login
  // credentials — access to the Web UI is gated by StartOS.
  await storeJson.write(effects, {
    title: 'Ashigaru Terminal',
    reconnect: false,
    manageSettings: true,
    serverType: 'electrs',
    bitcoindRpcUser: '',
    bitcoindRpcPassword: '',
    proxyType: 'tor',
  })
})
