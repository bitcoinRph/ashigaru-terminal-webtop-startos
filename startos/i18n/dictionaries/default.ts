export const DEFAULT_LANG = 'en_US'

const dict = {
  // interfaces.ts
  'Ashigaru Terminal UI': 0,
  'The Ashigaru Terminal on Webtop desktop interface': 1,

  // main.ts
  'Web Interface': 2,
  'The web interface is ready': 3,
  'The web interface is not ready': 4,

  // actions/getCredentials.ts
  'Get Webtop Credentials': 5,
  'View the username and password for your Webtop desktop': 6,

  // actions/configure.ts
  'Configure Ashigaru Terminal': 7,
  'Set the Webtop title and Ashigaru server/proxy settings': 8,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
