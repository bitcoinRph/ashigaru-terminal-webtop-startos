import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:8',
  releaseNotes: {
    en_US:
      'Add a keyboard-driven mouse so the wallet is fully operable when raw VNC mouse/touch clicks are unreliable in JavaFX (especially from the StartOS mobile app). Hold Super (Windows/Command key, or the on-screen keyboard’s Super key) with: Arrows to move the cursor (Shift+Arrows for larger steps), Enter to left click/select, Shift+Enter to double click, Backspace to right click. See the service instructions for details.',
    es_ES:
      'Añade un ratón controlado por teclado para que la billetera sea totalmente operable cuando los clics de ratón/táctiles por VNC no son fiables en JavaFX (especialmente desde la app móvil de StartOS). Mantén Super (tecla Windows/Command, o la tecla Super del teclado en pantalla) con: flechas para mover el cursor (Shift+flechas para pasos más grandes), Enter para clic izquierdo/seleccionar, Shift+Enter para doble clic, Retroceso para clic derecho. Consulta las instrucciones del servicio.',
    de_DE:
      'Fügt eine tastaturgesteuerte Maus hinzu, damit die Wallet voll bedienbar ist, wenn rohe VNC-Maus-/Touch-Klicks in JavaFX unzuverlässig sind (besonders in der StartOS-Mobil-App). Halte Super (Windows-/Command-Taste oder die Super-Taste der Bildschirmtastatur) mit: Pfeiltasten zum Bewegen des Cursors (Umschalt+Pfeile für größere Schritte), Enter für Linksklick/Auswahl, Umschalt+Enter für Doppelklick, Rücktaste für Rechtsklick. Details in den Dienstanweisungen.',
    pl_PL:
      'Dodaje mysz sterowaną klawiaturą, dzięki czemu portfel jest w pełni obsługiwalny, gdy surowe kliknięcia myszy/dotyku przez VNC są zawodne w JavaFX (zwłaszcza w aplikacji mobilnej StartOS). Przytrzymaj Super (klawisz Windows/Command lub klawisz Super klawiatury ekranowej) z: strzałkami, aby przesuwać kursor (Shift+strzałki dla większych kroków), Enter dla lewego kliknięcia/wyboru, Shift+Enter dla podwójnego kliknięcia, Backspace dla prawego kliknięcia. Zobacz instrukcje usługi.',
    fr_FR:
      'Ajoute une souris pilotée au clavier pour que le portefeuille soit pleinement utilisable lorsque les clics souris/tactiles bruts via VNC ne sont pas fiables dans JavaFX (surtout depuis l’app mobile StartOS). Maintenez Super (touche Windows/Command, ou la touche Super du clavier à l’écran) avec : flèches pour déplacer le curseur (Maj+flèches pour des pas plus grands), Entrée pour clic gauche/sélection, Maj+Entrée pour double-clic, Retour arrière pour clic droit. Voir les instructions du service.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
