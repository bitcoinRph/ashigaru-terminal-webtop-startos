import { utils } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { getCredentials } from '../actions/getCredentials'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  // Generate the initial Webtop password and seed sensible defaults. These can
  // all be changed later via the "Configure Ashigaru Terminal" action.
  const password = utils.getDefaultString({ charset: 'a-z,1-9', len: 20 })

  await storeJson.write(effects, {
    username: 'webtop',
    password,
    title: 'Ashigaru Terminal',
    reconnect: false,
    manageSettings: true,
    serverType: 'electrs',
    bitcoindRpcUser: '',
    bitcoindRpcPassword: '',
    proxyType: 'tor',
  })

  await sdk.action.createOwnTask(effects, getCredentials, 'critical', {
    reason: i18n('Retrieve your Webtop login credentials'),
  })
})
