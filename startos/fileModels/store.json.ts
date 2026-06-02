import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Persistent service state. Replaces the old Embassy config form: the Webtop
// login credentials and the Ashigaru server/proxy selections now live here and
// are edited through the "Configure Ashigaru Terminal" action.
const shape = z.object({
  username: z.string(),
  password: z.string(),
  title: z.string(),
  reconnect: z.boolean(),
  // Whether StartOS manages Ashigaru's server/proxy settings on startup. When
  // false, the user manages these from within Ashigaru Terminal itself.
  manageSettings: z.boolean(),
  serverType: z.enum(['electrs', 'bitcoind', 'public']),
  bitcoindRpcUser: z.string(),
  bitcoindRpcPassword: z.string(),
  proxyType: z.enum(['tor', 'none']),
})

export type Store = z.infer<typeof shape>

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
