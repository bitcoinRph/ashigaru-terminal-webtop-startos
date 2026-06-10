export const DEFAULT_LANG = 'en_US'

const dict = {
  // interfaces.ts
  'Ashigaru Terminal UI': 0,
  'The Ashigaru Terminal on Webtop desktop interface': 1,

  // main.ts
  'Web Interface': 2,
  'The web interface is ready': 3,
  'The web interface is not ready': 4,
  'Tor Proxy': 5,
  'The Tor SOCKS proxy is reachable': 6,
  'The Tor SOCKS proxy is unreachable. Install and start the Tor service on your StartOS server, or set the proxy to None in "Configure Ashigaru Terminal".': 7,

  // actions/configure.ts
  'Configure Ashigaru Terminal': 8,
  'Set the Webtop title and Ashigaru server/proxy settings': 9,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
