type UpdateNotificaionWindowTypes =
  | 'CHECKING_FOR_UPDATES'
  | 'UPDATE_AVAILABLE'
  | 'UPDATE_NOT_AVAILABLE'
  | 'DOWNLOAD_PROGRESS'
  | 'UPDATE_DOWNLOADED'
  | 'ERROR'

type UpdateNotificationWindow = {
  type: UpdateNotificaionWindowTypes
  content: any
}

type EventPayloadMapping = {
  downloadAppUpdate: AppUpdater
  installUpdateAndQuit: void
  updateNotificationWindow: UpdateNotificationWindow
  closeNotificationWindow: void
}

type UnsubscribeFunction = () => void

interface Window {
  electron: {
    downloadAppUpdate: () => AppUpdater
    installUpdateAndQuit: () => void
    updateNotificationWindow: (
      callback: (update: UpdateNotificationWindow) => void
    ) => void
    closeNotificationWindow: () => void
  }
}
