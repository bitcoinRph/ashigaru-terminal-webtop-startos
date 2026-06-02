import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Persistent service state. Replaces the old Embassy config form: the Webtop
// title and the Ashigaru server/proxy selections live here and are edited
// through the "Configure Ashigaru Terminal" action. There are no Webtop login
// credentials — access to the Web UI is gated by StartOS.
const shape = z.object({
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
