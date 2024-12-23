import { BrowserWindow, Menu, app } from 'electron'
import { isDev } from './utils.js'

export function createMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: process.platform === 'darwin' ? undefined : 'App',
        type: 'submenu',
        submenu: [
          {
            label: `Version ${app.getVersion()}`
          },
          {
            label: 'DevTools',
            click: () => mainWindow.webContents.openDevTools(),
            visible: isDev()
          },
          {
            label: 'Check for updates',
            click: () => window.electron.checkUpdates()
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit',
            click: app.quit
          }
        ]
      }
    ])
  )
}
