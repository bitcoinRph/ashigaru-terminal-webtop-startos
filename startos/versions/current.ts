import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:7',
  releaseNotes: {
    en_US:
      'Make Tor proxy connectivity more robust and diagnosable. If the StartOS Tor service stops accepting SOCKS connections at tor.startos:9050 (e.g. after a Tor update), the wallet and the Tor Proxy health check now also try the container network gateway and use whichever path actually answers, and the exact connection error is written to the service logs so a Tor-side problem can be pinpointed without shell access.',
    es_ES:
      'Hace que la conectividad del proxy Tor sea más robusta y diagnosticable. Si el servicio Tor de StartOS deja de aceptar conexiones SOCKS en tor.startos:9050 (por ejemplo, tras una actualización de Tor), la billetera y la comprobación de salud del proxy Tor también prueban la puerta de enlace de red del contenedor y usan la ruta que realmente responda, y el error de conexión exacto se escribe en los registros del servicio para poder localizar un problema del lado de Tor sin acceso a una terminal.',
    de_DE:
      'Macht die Tor-Proxy-Konnektivität robuster und besser diagnostizierbar. Wenn der StartOS-Tor-Dienst keine SOCKS-Verbindungen mehr unter tor.startos:9050 annimmt (z. B. nach einem Tor-Update), versuchen die Wallet und der Tor-Proxy-Health-Check jetzt auch das Container-Netzwerk-Gateway und nutzen den Pfad, der tatsächlich antwortet; der genaue Verbindungsfehler wird in die Dienstprotokolle geschrieben, sodass ein Tor-seitiges Problem ohne Shell-Zugriff eingegrenzt werden kann.',
    pl_PL:
      'Zwiększa niezawodność i diagnozowalność łączności proxy Tor. Jeśli usługa Tor w StartOS przestanie przyjmować połączenia SOCKS pod tor.startos:9050 (np. po aktualizacji Tora), portfel i kontrola stanu proxy Tor próbują teraz także bramy sieciowej kontenera i używają ścieżki, która faktycznie odpowiada, a dokładny błąd połączenia jest zapisywany w logach usługi, dzięki czemu problem po stronie Tora można zlokalizować bez dostępu do powłoki.',
    fr_FR:
      'Rend la connectivité du proxy Tor plus robuste et diagnostiquable. Si le service Tor de StartOS cesse d’accepter les connexions SOCKS sur tor.startos:9050 (par exemple après une mise à jour de Tor), le portefeuille et le contrôle de santé du proxy Tor essaient désormais aussi la passerelle réseau du conteneur et utilisent le chemin qui répond réellement ; l’erreur de connexion exacte est écrite dans les journaux du service afin de cerner un problème côté Tor sans accès à un terminal.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
