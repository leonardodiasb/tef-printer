import { app, BrowserWindow, globalShortcut, Menu } from 'electron'
import path from 'path'
import { ipcMainHandle, ipcMainOn, isDev } from './utils.js'
import { getStaticData, poolResource } from './resourceManager.js'
import { getPreloadPath } from './pathResolver.js'
import { createTray } from './tray.js'
import { createMenu } from './menu.js'

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
  poolResource(mainWindow)

  globalShortcut.register('CommandOrControl+X', () => {
    console.log('CommandOrControl+X is pressed')
  })

  ipcMainHandle('getStaticData', () => {
    return getStaticData()
  })

  ipcMainOn('sendFrameAction', (payload) => {
    switch (payload) {
      case 'CLOSE':
        mainWindow.close()
        break
      case 'MAXIMIZE':
        mainWindow.maximize()
        break
      case 'MINIMIZE':
        mainWindow.minimize()
        break
    }
  })

  createTray(mainWindow)
  handleCloseEvents(mainWindow)
  createMenu(mainWindow)
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
