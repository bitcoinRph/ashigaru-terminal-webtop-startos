import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:6',
  releaseNotes: {
    en_US:
      'Fix the mouse being unusable inside Ashigaru Terminal: clicks were silently dropped (the cursor moved and the keyboard worked, but nothing was clickable). JavaFX routed pointer input through XInput2, which KasmVNC does not deliver correctly; the desktop now forces legacy core X pointer events (GDK_CORE_DEVICE_EVENTS=1) and disables the cosmetic compositor, so the wallet is fully clickable.',
    es_ES:
      'Corrige que el ratón no funcionara dentro de Ashigaru Terminal: los clics se descartaban de forma silenciosa (el cursor se movía y el teclado funcionaba, pero no se podía hacer clic en nada). JavaFX enrutaba la entrada del puntero a través de XInput2, que KasmVNC no entrega correctamente; el escritorio ahora fuerza los eventos de puntero X clásicos (GDK_CORE_DEVICE_EVENTS=1) y desactiva el compositor cosmético, de modo que se puede hacer clic en toda la billetera.',
    de_DE:
      'Behebt, dass die Maus in Ashigaru Terminal unbrauchbar war: Klicks wurden stillschweigend verworfen (der Cursor bewegte sich und die Tastatur funktionierte, aber nichts war anklickbar). JavaFX leitete die Zeigereingabe über XInput2, das KasmVNC nicht korrekt liefert; der Desktop erzwingt jetzt klassische X-Zeigerereignisse (GDK_CORE_DEVICE_EVENTS=1) und deaktiviert den kosmetischen Compositor, sodass die Wallet vollständig anklickbar ist.',
    pl_PL:
      'Naprawia brak działania myszy w Ashigaru Terminal: kliknięcia były po cichu pomijane (kursor się poruszał, klawiatura działała, ale nic nie dało się kliknąć). JavaFX kierował wejście wskaźnika przez XInput2, którego KasmVNC nie dostarcza poprawnie; pulpit wymusza teraz klasyczne zdarzenia wskaźnika X (GDK_CORE_DEVICE_EVENTS=1) i wyłącza kosmetyczny kompozytor, dzięki czemu cały portfel jest klikalny.',
    fr_FR:
      'Corrige la souris inutilisable dans Ashigaru Terminal : les clics étaient silencieusement ignorés (le curseur bougeait et le clavier fonctionnait, mais rien n’était cliquable). JavaFX acheminait l’entrée du pointeur via XInput2, que KasmVNC ne transmet pas correctement ; le bureau force désormais les événements de pointeur X classiques (GDK_CORE_DEVICE_EVENTS=1) et désactive le compositeur cosmétique, de sorte que tout le portefeuille est cliquable.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
