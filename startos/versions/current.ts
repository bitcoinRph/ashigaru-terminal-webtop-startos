import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:0',
  releaseNotes: {
    en_US: 'Repackaged for the latest version of StartOS.',
    es_ES: 'Reempaquetado para la última versión de StartOS.',
    de_DE: 'Neu verpackt für die neueste Version von StartOS.',
    pl_PL: 'Przepakowane dla najnowszej wersji StartOS.',
    fr_FR: 'Reconditionné pour la dernière version de StartOS.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
