import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:2',
  releaseNotes: {
    en_US:
      'Remove the Webtop login: the Web UI now opens directly, with access controlled by StartOS.',
    es_ES:
      'Elimina el inicio de sesión de Webtop: la interfaz web ahora se abre directamente, con el acceso controlado por StartOS.',
    de_DE:
      'Entfernt die Webtop-Anmeldung: Die Weboberfläche öffnet sich jetzt direkt, der Zugriff wird von StartOS gesteuert.',
    pl_PL:
      'Usuwa logowanie do Webtop: interfejs webowy otwiera się teraz bezpośrednio, a dostęp kontroluje StartOS.',
    fr_FR:
      'Supprime la connexion Webtop : l’interface web s’ouvre désormais directement, l’accès étant contrôlé par StartOS.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
