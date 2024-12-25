import { app, BrowserWindow, globalShortcut, Menu } from 'electron'
import path from 'path'
import { ipcMainHandle, isDev } from './utils.js'
import { getPreloadPath } from './pathResolver.js'
import { createTray } from './tray.js'
import { createMenu } from './menu.js'
import AutoUpdaterService from './services/AutoUpdaterService.js'

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

  ipcMainHandle('downloadAppUpdate', async () => {
    autoUpdaterService.updateApp()
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
