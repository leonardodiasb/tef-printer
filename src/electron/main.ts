import { app, BrowserWindow, globalShortcut, Menu } from 'electron'
import path from 'path'
import { ipcMainHandle, ipcMainOn, isDev } from './utils.js'
import { getStaticData, poolResource } from './resourceManager.js'
import { getPreloadPath } from './pathResolver.js'
import { createTray } from './tray.js'
import { createMenu } from './menu.js'
// import electronUpdater, { type AppUpdater } from 'electron-updater'
// import { autoUpdater } from 'electron-updater'

// export function getAutoUpdater(): AppUpdater {
//   const { autoUpdater } = electronUpdater
//   return autoUpdater
// }

Menu.setApplicationMenu(null)

// const autoUpdater = getAutoUpdater()

// autoUpdater.forceDevUpdateConfig = true
// autoUpdater.autoDownload = false
// autoUpdater.autoInstallOnAppQuit = true
// autoUpdater.on('update-available', (info) => {
//   console.log(`Update available. Current version ${app.getVersion()}`, info)
//   // autoUpdater.do
// })
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

  // autoUpdater.checkForUpdates()

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

  // ipcMainHandle('downloadAppUpdate', () => {
  //   return autoUpdater.downloadUpdate()
  // })

  // ipcMainHandle('installUpdateAndQuit', () => {
  //   return autoUpdater.quitAndInstall()
  // })

  // ipcMainHandle('checkUpdates', () => {
  //   return autoUpdater.checkForUpdates()
  // })

  // ipcMainHandle('checkUpdatesAndNotify', () => {
  //   return autoUpdater.checkForUpdatesAndNotify()
  // })

  createTray(mainWindow)
  handleCloseEvents(mainWindow)
  createMenu(mainWindow)
})

/*New Update Available*/
// autoUpdater.on('update-available', (info) => {
//   console.log(`Update available. Current version ${app.getVersion()}`, info)
//   const pth = autoUpdater.downloadUpdate()
//   console.log(pth)
// })

// autoUpdater.on('update-available', (info) => {
//   console.log(`Update available. Current version ${app.getVersion()}`, info)
//   // autoUpdater.do
// })

// autoUpdater.on('checking-for-update', () => {
//   console.log('Checking for update...')
// })

// autoUpdater.on('update-not-available', (info) => {
//   console.log(`No update available. Current version ${app.getVersion()}`, info)
// })

// autoUpdater.on('download-progress', (progress) => {
//   console.log(`Download progress ${progress.percent}`)
// })
// autoUpdater.on('error', (error) => {
//   console.log(`Error in auto-updater. ${error}`)
// })

// /*Download Completion Message*/
// autoUpdater.on('update-downloaded', (info) => {
//   // console.log(`Update downloaded. Current version ${app.getVersion()}`, info)
//   // autoUpdater.quitAndInstall()
// })

// autoUpdater.on('error', (info) => {
//   console.log(info)
// })
// autoUpdater.checkForUpdatesAndNotify()

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
