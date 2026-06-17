import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:5',
  releaseNotes: {
    en_US:
      'Fix a false "Tor SOCKS proxy is unreachable" error shown when the Tor service was actually installed and running. The Tor Proxy health check now opens a real TCP connection to tor.startos:9050 first (using an absolute socat path so it cannot fail to be found on PATH) and only consults DNS to explain a genuine failure, so name-resolution quirks can no longer report a reachable proxy as down.',
    es_ES:
      'Corrige un error falso de «el proxy SOCKS de Tor es inaccesible» que aparecía cuando el servicio Tor en realidad estaba instalado y en ejecución. La comprobación de salud del proxy Tor ahora abre primero una conexión TCP real a tor.startos:9050 (con una ruta absoluta de socat para que no falle por no encontrarse en el PATH) y solo consulta el DNS para explicar un fallo real, de modo que las peculiaridades de resolución de nombres ya no pueden marcar como caído un proxy accesible.',
    de_DE:
      'Behebt eine falsche Fehlermeldung „Tor-SOCKS-Proxy nicht erreichbar“, die angezeigt wurde, obwohl der Tor-Dienst tatsächlich installiert war und lief. Der Tor-Proxy-Health-Check öffnet jetzt zuerst eine echte TCP-Verbindung zu tor.startos:9050 (mit absolutem socat-Pfad, damit er nicht am PATH scheitern kann) und zieht DNS nur heran, um einen echten Fehler zu erklären. Eigenheiten der Namensauflösung können einen erreichbaren Proxy somit nicht mehr als ausgefallen melden.',
    pl_PL:
      'Naprawia fałszywy błąd „Proxy SOCKS Tora jest nieosiągalne”, pokazywany, gdy usługa Tor była w rzeczywistości zainstalowana i działała. Kontrola stanu proxy Tor najpierw otwiera teraz prawdziwe połączenie TCP z tor.startos:9050 (używając bezwzględnej ścieżki do socat, aby nie mogła zawieść z powodu PATH) i odwołuje się do DNS tylko po to, by wyjaśnić rzeczywistą awarię, więc osobliwości rozwiązywania nazw nie mogą już zgłaszać osiągalnego proxy jako niedostępnego.',
    fr_FR:
      'Corrige une fausse erreur « le proxy SOCKS Tor est injoignable » affichée alors que le service Tor était en réalité installé et en cours d’exécution. Le contrôle de santé du proxy Tor ouvre désormais d’abord une vraie connexion TCP vers tor.startos:9050 (avec un chemin absolu vers socat afin qu’il ne puisse pas échouer faute d’être trouvé dans le PATH) et ne consulte le DNS que pour expliquer une véritable panne ; les particularités de résolution de noms ne peuvent donc plus signaler comme indisponible un proxy joignable.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
