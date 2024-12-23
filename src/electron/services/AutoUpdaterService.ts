/* eslint-disable prettier/prettier */
import { BrowserWindow } from 'electron'
import electronUpdater, { type AppUpdater } from 'electron-updater'
import { isDev } from '../utils.js'

const { autoUpdater } = electronUpdater

interface AutoUpdaterServiceInterface {
  checkForUpdates(): void
  updateApp(): void
}

export default class AutoUpdaterService implements AutoUpdaterServiceInterface {
  private window: BrowserWindow
  private enableAutoDownload = false
  private enableAutoInstallOnAppQuit = false
  private enableDevMode = isDev()

  constructor(mainWindow: BrowserWindow) {
    this.window = mainWindow
    this.configureAutoUpdater()
    this.setupListeners()
  }

  public checkForUpdates = () => {
    autoUpdater.checkForUpdates()
  }

  public updateApp = () => {
    autoUpdater.downloadUpdate()
  }

  private configureAutoUpdater = () => {
    autoUpdater.forceDevUpdateConfig = this.enableDevMode
    autoUpdater.autoInstallOnAppQuit = this.enableAutoInstallOnAppQuit
    autoUpdater.autoDownload = this.enableAutoDownload
  }

  private setupListeners = () => {
    if (!autoUpdater) {
      return
    }
    autoUpdater.on('update-available', (info) => {
      console.log(`Update available. Current version `)
    })

    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for update...')
    })

    autoUpdater.on('update-not-available', (info) => {
      console.log(`No update available. Current version `)
    })

    autoUpdater.on('download-progress', (progress) => {
      console.log(`Download progress ${progress.percent}`)
    })

    autoUpdater.on('update-downloaded', (info) => {
      console.log(`Update downloaded. Current version `)
    })

    autoUpdater.on('error', (error) => {
      console.log(`Error in auto-updater. ${error}`)
    })
  }
}
