/* eslint-disable prettier/prettier */
import { app, BrowserWindow } from 'electron'
import electronUpdater, { type AppUpdater } from 'electron-updater'
import { ipcWebContentsSend, isDev } from '../utils.js'
import path from 'path'
import { getPreloadPath } from '../pathResolver.js'

const { autoUpdater } = electronUpdater

export interface AutoUpdaterServiceInterface {
  checkForUpdates(): void
  updateApp(): void
}

export default class AutoUpdaterService implements AutoUpdaterServiceInterface {
  private mainWindow: BrowserWindow
  private notificationWindow: BrowserWindow | null = null
  private enableAutoDownload = false
  private enableAutoInstallOnAppQuit = false
  private enableDevMode = isDev()

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.configureAutoUpdater()
    this.setupListeners()
  }

  public checkForUpdates = () => {
    this.createNotificationWindow()
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
    autoUpdater.on('checking-for-update', () => {
      this.updateNotificationContent('CHECKING_FOR_UPDATES', 'Checking for updates...', true)
    })

    autoUpdater.on('update-available', (info) => {
      this.updateNotificationContent('UPDATE_AVAILABLE', info, false)
    })

    autoUpdater.on('update-not-available', (info) => {
      this.updateNotificationContent('UPDATE_NOT_AVAILABLE', info, false)
      // this.closeNotificationWindowAfterDelay()
    })

    autoUpdater.on('download-progress', (progress) => {
      this.updateNotificationContent('DOWNLOAD_PROGRESS', {progress, string: `Download progress: ${progress.percent.toFixed(2)}%`}, true)
    })

    autoUpdater.on('update-downloaded', (info) => {
      this.updateNotificationContent('UPDATE_DOWNLOADED', info, false)
      // this.closeNotificationWindowAfterDelay()
    })

    autoUpdater.on('error', (error) => {
      this.updateNotificationContent('ERROR', error, false)
      // this.closeNotificationWindowAfterDelay()
    })
  }

  private createNotificationWindow = () => {
    if (this.notificationWindow) return
  
    this.notificationWindow = new BrowserWindow({
      width: 1400,
      height: 1200,
      // resizable: false,
      // alwaysOnTop: true,
      parent: this.mainWindow,
      // modal: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: getPreloadPath()
      },
    })
    this.notificationWindow.webContents.openDevTools()
  
    if (isDev()) {
      this.notificationWindow.loadURL('http://localhost:5123/notification.html')
    } else {
      this.notificationWindow.loadFile(path.join(app.getAppPath(), '/dist-react/notification.html'))
    }

    this.notificationWindow.on('closed', () => {
      this.notificationWindow = null;
    });
  }

  private updateNotificationContent = (type: UpdateNotificaionWindowTypes, content: any, isLoading: boolean) => {
    if (this.notificationWindow) {
      ipcWebContentsSend('updateNotificationWindow', this.notificationWindow.webContents, {
        type,
        content,
        isLoading
      })
    }
  }

  private closeNotificationWindowAfterDelay = (delay: number = 3000) => {
    setTimeout(() => {
      if (this.notificationWindow) {
        this.notificationWindow.close()
        this.notificationWindow = null
      }
    }, delay)
  }
}
