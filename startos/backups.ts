import { sdk } from './sdk'

// Back up both the package state volume ('main') and the Webtop home
// directory ('userdir', mounted at /config) so wallets and desktop
// settings survive a restore.
export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.ofVolumes('main', 'userdir'),
)
