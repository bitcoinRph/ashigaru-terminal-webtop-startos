import { setupManifest } from '@start9labs/start-sdk'
import { short, long, alertInstall } from './i18n'

export const manifest = setupManifest({
  id: 'ashigaru-webtop',
  title: 'Ashigaru Terminal',
  license: 'GPL-3.0-only',
  packageRepo: 'https://github.com/linkinparkrulz/ashigaru-webtop-startos',
  upstreamRepo: 'https://github.com/linkinparkrulz/ashigaru-terminal',
  marketingUrl: 'https://github.com/linkinparkrulz/ashigaru-terminal',
  donationUrl: null,
  description: { short, long },
  volumes: ['main', 'userdir'],
  images: {
    main: {
      source: {
        dockerBuild: {
          workdir: '.',
        },
      },
      // Ashigaru Terminal is distributed as an amd64-only .deb package.
      arch: ['x86_64'],
    },
  },
  alerts: {
    install: alertInstall,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    bitcoind: {
      description:
        'Connect Ashigaru Terminal to a private Bitcoin Core server running on your StartOS device.',
      optional: true,
      s9pk: null,
    },
    electrs: {
      description:
        'Connect Ashigaru Terminal to a private Electrum server running on your StartOS device.',
      optional: true,
      s9pk: null,
    },
    tor: {
      description:
        'Route Ashigaru Terminal traffic through the Tor network for privacy.',
      optional: true,
      s9pk: null,
    },
  },
})
