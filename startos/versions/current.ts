import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:4',
  releaseNotes: {
    en_US:
      'Fix the wallet window not appearing / not responding to clicks: the upstream launcher forced headless JavaFX (Monocle/Headless), so no window was drawn on the desktop. It now renders normally via GTK with software rendering. Also improves the Tor Proxy health check to distinguish a missing Tor service from an unreachable one.',
    es_ES:
      'Corrige que la ventana de la billetera no aparezca / no responda a los clics: el lanzador original forzaba JavaFX sin interfaz (Monocle/Headless), por lo que no se dibujaba ninguna ventana. Ahora se renderiza con normalidad mediante GTK con renderizado por software. También mejora la comprobación de salud del proxy Tor para distinguir un servicio Tor ausente de uno inaccesible.',
    de_DE:
      'Behebt, dass das Wallet-Fenster nicht erscheint / nicht auf Klicks reagiert: Der Upstream-Launcher erzwang headless JavaFX (Monocle/Headless), sodass kein Fenster gezeichnet wurde. Es wird jetzt normal über GTK mit Software-Rendering dargestellt. Verbessert außerdem den Tor-Proxy-Health-Check, um einen fehlenden von einem nicht erreichbaren Tor-Dienst zu unterscheiden.',
    pl_PL:
      'Naprawia brak okna portfela / brak reakcji na kliknięcia: program uruchamiający z upstreamu wymuszał bezgłowy JavaFX (Monocle/Headless), więc okno nie było rysowane. Teraz renderuje się normalnie przez GTK z renderowaniem programowym. Ulepsza także kontrolę stanu proxy Tor, aby odróżnić brakującą usługę Tor od nieosiągalnej.',
    fr_FR:
      'Corrige la fenêtre du portefeuille qui n’apparaît pas / ne répond pas aux clics : le lanceur amont forçait JavaFX sans interface (Monocle/Headless), donc aucune fenêtre n’était dessinée. Le rendu se fait désormais normalement via GTK avec rendu logiciel. Améliore aussi le contrôle de santé du proxy Tor pour distinguer un service Tor absent d’un service injoignable.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
