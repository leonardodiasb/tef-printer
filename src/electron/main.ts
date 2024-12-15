import { app, BrowserWindow } from 'electron'
import path from 'path'
import { ipcMainHandle, isDev } from './utils.js'
import { getStaticData, poolResource } from './resourceManager.js'
import { getPreloadPath } from './pathResolver.js'
import { createTray } from './tray.js'

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath()
    }
  })
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123')
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'))
  }
  poolResource(mainWindow)

  ipcMainHandle('getStaticData', () => {
    return getStaticData()
  })

  createTray(mainWindow)

  handleCloseEvents(mainWindow)
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
