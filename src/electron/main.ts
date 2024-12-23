import { app, BrowserWindow, globalShortcut, ipcMain, Menu } from 'electron'
import path from 'path'
import { ipcMainHandle, ipcMainOn, isDev } from './utils.js'
import { getStaticData, poolResource } from './resourceManager.js'
import { getPreloadPath } from './pathResolver.js'
import { createTray } from './tray.js'
import { createMenu } from './menu.js'
// import electronUpdater from 'electron-updater'

Menu.setApplicationMenu(null)

// const { autoUpdater } = electronUpdater

// autoUpdater.forceDevUpdateConfig = true
// autoUpdater.autoDownload = false
// autoUpdater.autoInstallOnAppQuit = true

// const dialogWindow = () => {
//   const dialog = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: getPreloadPath()
//     }
//   })
//   dialog.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'))
//   return dialog
// }

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

  // ipcMainHandle('downloadAppUpdate', () => {
  //   return autoUpdater.downloadUpdate()
  // })

  // ipcMainHandle('installUpdateAndQuit', () => {
  //   return autoUpdater.quitAndInstall()
  // })

  // ipcMainHandle('checkUpdates', () => {
  //   return autoUpdater.checkForUpdates()
  // })

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
