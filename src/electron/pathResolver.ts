import { isDev } from './utils.js'
import path from 'path'
import { app } from 'electron'

export const getPreloadPath = () => {
  return path.join(
    app.getAppPath(),
    isDev() ? '.' : '..',
    '/dist-electron/preload.cjs'
  )
}

export function getUIPath() {
  return path.join(app.getAppPath(), '/dist-react/index.html')
}

export function getUINotificationPath() {
  return path.join(app.getAppPath(), '/dist-react/notification.html')
}

export function getUIPrintablePagePath() {
  return path.join(app.getAppPath(), '/dist-react/printablePage.html')
}

export function getAssetPath() {
  return path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/assets')
}

export const getInstallDirectoryPath = () => {
  const exePath = app.getPath('exe')
  if (process.platform === 'darwin') {
    return app.getPath('userData')
  } else if (process.platform === 'win32') {
    return path.dirname(exePath)
  } else {
    throw new Error(`Unsupported platform: ${process.platform}`)
  }
}
