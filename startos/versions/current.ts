import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:3',
  releaseNotes: {
    en_US:
      'Fix Tor: route Ashigaru through the StartOS Tor service (tor.startos:9050) instead of the container gateway, add the Tor service as an optional dependency, and show Tor proxy reachability as a health check.',
    es_ES:
      'Corrección de Tor: Ashigaru ahora usa el servicio Tor de StartOS (tor.startos:9050) en lugar de la puerta de enlace del contenedor, se añade el servicio Tor como dependencia opcional y se muestra la accesibilidad del proxy Tor como comprobación de salud.',
    de_DE:
      'Tor-Fix: Ashigaru nutzt jetzt den StartOS-Tor-Dienst (tor.startos:9050) statt des Container-Gateways, der Tor-Dienst ist eine optionale Abhängigkeit und die Erreichbarkeit des Tor-Proxys wird als Health-Check angezeigt.',
    pl_PL:
      'Poprawka Tor: Ashigaru korzysta teraz z usługi Tor w StartOS (tor.startos:9050) zamiast bramy kontenera, usługa Tor jest opcjonalną zależnością, a osiągalność proxy Tor jest widoczna jako kontrola stanu.',
    fr_FR:
      'Correctif Tor : Ashigaru passe désormais par le service Tor de StartOS (tor.startos:9050) au lieu de la passerelle du conteneur, le service Tor devient une dépendance optionnelle et la joignabilité du proxy Tor est affichée comme contrôle de santé.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
