import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:1',
  releaseNotes: {
    en_US:
      'Fix: run the container as PID 1 so the Webtop (s6-overlay) desktop starts correctly.',
    es_ES:
      'Corrección: ejecutar el contenedor como PID 1 para que el escritorio Webtop (s6-overlay) se inicie correctamente.',
    de_DE:
      'Fix: Container als PID 1 ausführen, damit der Webtop-Desktop (s6-overlay) korrekt startet.',
    pl_PL:
      'Poprawka: uruchamianie kontenera jako PID 1, aby pulpit Webtop (s6-overlay) startował poprawnie.',
    fr_FR:
      'Correctif : exécuter le conteneur en tant que PID 1 pour que le bureau Webtop (s6-overlay) démarre correctement.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
