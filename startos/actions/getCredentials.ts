import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

export const getCredentials = sdk.Action.withoutInput(
  'get-credentials',

  async () => ({
    name: i18n('Get Webtop Credentials'),
    description: i18n('View the username and password for your Webtop desktop'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const store = await storeJson.read((s) => s).once()

    return {
      version: '1' as const,
      title: 'Webtop Credentials',
      message: 'Use these credentials to log into your Webtop desktop.',
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: 'Username',
            description: null,
            value: store?.username ?? 'UNKNOWN',
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: 'Password',
            description: null,
            value: store?.password ?? 'UNKNOWN',
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
