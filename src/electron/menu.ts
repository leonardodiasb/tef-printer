import { BrowserWindow, Menu, app } from 'electron'
import { isDev } from './utils.js'
import { AutoUpdaterServiceInterface } from './services/AutoUpdaterService.js'

export function createMenu(
  mainWindow: BrowserWindow,
  autoUpdaterService: AutoUpdaterServiceInterface
) {
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
            click: () => {
              autoUpdaterService.checkForUpdates()
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit',
            accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Alt+F4',
            click: app.quit
          }
        ]
      }
    ])
  )
}
