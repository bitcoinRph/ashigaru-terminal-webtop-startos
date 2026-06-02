import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value, Variants } = sdk

export const inputSpec = InputSpec.of({
  username: Value.text({
    name: 'Username',
    description: 'The username for logging into your Webtop desktop.',
    required: true,
    default: 'webtop',
    patterns: [
      {
        regex: '^[^\\n"]*$',
        description: 'Must not contain newline or quote characters.',
      },
    ],
  }),
  password: Value.text({
    name: 'Password',
    description: 'The password for logging into your Webtop desktop.',
    required: true,
    masked: true,
    default: { charset: 'a-z,1-9', len: 20 },
    generate: { charset: 'a-z,1-9', len: 20 },
    patterns: [
      {
        regex: '^[^\\n"]*$',
        description: 'Must not contain newline or quote characters.',
      },
    ],
  }),
  title: Value.text({
    name: 'Webtop Title',
    description: 'Displayed as the title of your browser tab.',
    required: true,
    default: 'Ashigaru Terminal',
    patterns: [
      {
        regex: '^[^\\n"]*$',
        description: 'Must not contain newline or quote characters.',
      },
    ],
  }),
  reconnect: Value.toggle({
    name: 'Automatically reconnect',
    description:
      'Automatically reconnect when the connection to the desktop is lost or the browser tab has been idle for too long.',
    default: false,
  }),
  manageSettings: Value.toggle({
    name: 'Apply settings on startup',
    description:
      'Let StartOS configure Ashigaru Terminal’s server and proxy settings on startup. Disable to manage these yourself from within Ashigaru Terminal.',
    default: true,
  }),
  server: Value.union({
    name: 'Bitcoin/Electrum Server',
    description:
      'The Bitcoin Core or Electrum node Ashigaru Terminal connects to. Electrs and Bitcoin Core use the corresponding service installed on your StartOS device. Public uses a public Bitcoin node (not recommended).',
    default: 'electrs',
    variants: Variants.of({
      electrs: { name: 'Electrs (recommended)', spec: InputSpec.of({}) },
      bitcoind: {
        name: 'Bitcoin Core',
        spec: InputSpec.of({
          rpcUser: Value.text({
            name: 'RPC Username',
            description: 'The username for Bitcoin Core’s RPC interface.',
            required: true,
            default: null,
          }),
          rpcPassword: Value.text({
            name: 'RPC Password',
            description: 'The password for Bitcoin Core’s RPC interface.',
            required: true,
            masked: true,
            default: null,
          }),
        }),
      },
      public: { name: 'Public (not recommended)', spec: InputSpec.of({}) },
    }),
  }),
  proxy: Value.union({
    name: 'Use a proxy',
    description:
      'Use a proxy for external connections. Tor uses the StartOS Tor proxy (recommended). None disables the proxy.',
    default: 'tor',
    variants: Variants.of({
      tor: { name: 'Tor (recommended)', spec: InputSpec.of({}) },
      none: { name: 'None (not recommended)', spec: InputSpec.of({}) },
    }),
  }),
})

export const configure = sdk.Action.withInput(
  'configure',

  async () => ({
    name: i18n('Configure Ashigaru Terminal'),
    description: i18n(
      'Set your Webtop login and Ashigaru server/proxy settings',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  // Pre-fill the form with the current stored values.
  async ({ effects }) => {
    const store = await storeJson.read((s) => s).const(effects)
    if (!store) return null

    return {
      username: store.username,
      password: store.password,
      title: store.title,
      reconnect: store.reconnect,
      manageSettings: store.manageSettings,
      server:
        store.serverType === 'bitcoind'
          ? {
              selection: 'bitcoind' as const,
              value: {
                rpcUser: store.bitcoindRpcUser,
                rpcPassword: store.bitcoindRpcPassword,
              },
            }
          : { selection: store.serverType, value: {} },
      proxy: { selection: store.proxyType, value: {} },
    }
  },

  // Persist the submitted values back to the store.
  async ({ effects, input }) =>
    storeJson.merge(effects, {
      username: input.username,
      password: input.password,
      title: input.title,
      reconnect: input.reconnect,
      manageSettings: input.manageSettings,
      serverType: input.server.selection,
      bitcoindRpcUser:
        input.server.selection === 'bitcoind' ? input.server.value.rpcUser : '',
      bitcoindRpcPassword:
        input.server.selection === 'bitcoind'
          ? input.server.value.rpcPassword
          : '',
      proxyType: input.proxy.selection,
    }),
)
