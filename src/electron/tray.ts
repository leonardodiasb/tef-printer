import { app, BrowserWindow, Menu, Tray } from 'electron'
import { getAssetPath } from './pathResolver.js'
import path from 'path'

export const createTray = (mainWindow: BrowserWindow) => {
  const tray = new Tray(
    path.join(
      getAssetPath(),
      process.platform !== 'darwin'
        ? 'trayIcon@2x.png'
        : 'trayIconTemplate@2x.png'
    )
  )
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Show',
        click: () => {
          mainWindow.show()
          if (app.dock) {
            app.dock.show()
          }
        }
      },
      {
        label: 'Quit',
        click: () => {
          app.quit()
        }
      }
    ])
  )
}
