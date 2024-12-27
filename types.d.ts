type UpdateNotificaionWindowTypes =
  | 'CHECKING_FOR_UPDATES'
  | 'UPDATE_AVAILABLE'
  | 'UPDATE_NOT_AVAILABLE'
  | 'DOWNLOAD_PROGRESS'
  | 'UPDATE_DOWNLOADED'
  | 'ERROR'

type UpdateNotificationWindow = {
  type: UpdateNotificaionWindowTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
}

type StoneConfig = {
  StoneCode: string
  COMPort: string
}

type EventPayloadMapping = {
  downloadAppUpdate: AppUpdater
  updateNotificationWindow: UpdateNotificationWindow
  closeNotificationWindow: void
  writeConfigFile: StoneConfig
  readConfigFile: StoneConfig
}

type UnsubscribeFunction = () => void

interface Window {
  electron: {
    downloadAppUpdate: () => AppUpdater
    updateNotificationWindow: (
      callback: (update: UpdateNotificationWindow) => void
    ) => void
    closeNotificationWindow: () => void
    writeConfigFile: (payload: StoneConfig) => void
    readConfigFile: (callback: (payload: StoneConfig) => void) => void
  }
}
