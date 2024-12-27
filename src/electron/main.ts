import { app, BrowserWindow, Menu } from 'electron'
import path from 'path'
import { ipcMainHandle, ipcMainOn, ipcWebContentsSend, isDev } from './utils.js'
import { getInstallDirectoryPath, getPreloadPath } from './pathResolver.js'
import { createTray } from './tray.js'
import { createMenu } from './menu.js'
import AutoUpdaterService from './services/AutoUpdaterService.js'
import fs from 'fs'
import Server from './server.js'

Menu.setApplicationMenu(null)

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath()
    }
    // frame: false
  })
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123')
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'))
  }
  const autoUpdaterService = new AutoUpdaterService(mainWindow)
  const installDir = getInstallDirectoryPath()
  const server = new Server()
  server.start()

  ipcMainHandle('downloadAppUpdate', async () => {
    autoUpdaterService.updateApp()
  })

  ipcMainHandle('closeNotificationWindow', () => {
    autoUpdaterService.closeNotificationWindow()
  })

  ipcMainOn('writeConfigFile', (payload) => {
    try {
      const configPath = isDev()
        ? path.join(app.getPath('userData'), 'config.json')
        : path.join(installDir, 'config.json')

      fs.writeFileSync(configPath, JSON.stringify(payload))
    } catch (error) {
      console.log('Error', error)
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    try {
      const config = fs.readFileSync(
        isDev()
          ? path.join(app.getPath('userData'), 'config.json')
          : path.join(installDir, 'config.json'),
        'utf8'
      )

      if (config) {
        ipcWebContentsSend(
          'readConfigFile',
          mainWindow.webContents,
          JSON.parse(config)
        )
      }
    } catch (error) {
      console.log('Error', error)
    }
  })

  createTray(mainWindow)
  handleCloseEvents(mainWindow)
  createMenu(mainWindow, autoUpdaterService)
})

const handleCloseEvents = (mainWindow: BrowserWindow) => {
  let willClose = false

  mainWindow.on('close', (e) => {
    if (willClose) {
      return
    }
    e.preventDefault()
    mainWindow.hide()
    if (app.dock) {
      app.dock.hide()
    }
  })

  app.on('before-quit', () => {
    willClose = true
  })

  mainWindow.on('show', () => {
    willClose = false
  })
}
