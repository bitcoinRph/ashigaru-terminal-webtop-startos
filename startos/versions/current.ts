import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:4',
  releaseNotes: {
    en_US:
      'Improve the Tor Proxy health check: it now reports whether the Tor service is missing (not installed/running) or installed but unreachable, and no longer depends on the exec PATH.',
    es_ES:
      'Mejora la comprobación de salud del proxy Tor: ahora indica si el servicio Tor falta (no instalado o detenido) o está instalado pero inaccesible, y ya no depende del PATH de ejecución.',
    de_DE:
      'Verbessert den Tor-Proxy-Health-Check: Er zeigt jetzt an, ob der Tor-Dienst fehlt (nicht installiert/gestartet) oder installiert, aber nicht erreichbar ist, und hängt nicht mehr vom Exec-PATH ab.',
    pl_PL:
      'Ulepszona kontrola stanu proxy Tor: teraz wskazuje, czy usługa Tor jest nieobecna (niezainstalowana/zatrzymana), czy zainstalowana, ale nieosiągalna, i nie zależy już od PATH wykonania.',
    fr_FR:
      "Améliore le contrôle de santé du proxy Tor : il indique désormais si le service Tor est absent (non installé/arrêté) ou installé mais injoignable, et ne dépend plus du PATH d'exécution.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
