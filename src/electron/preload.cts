import electron from 'electron'

electron.contextBridge.exposeInMainWorld('electron', {
  subscribeStatistics: (callback) => {
    ipcOn('statistics', (statistics) => callback(statistics))
  },
  getStaticData: () => ipcInvoke('getStaticData'),
  subscribeChangeView: (callback) => {
    ipcOn('changeView', (view) => callback(view))
  },
  sendFrameAction: (payload) => {
    ipcSend('sendFrameAction', payload)
  },
  downloadAppUpdate: () => ipcInvoke('downloadAppUpdate'),
  checkUpdates: () => ipcInvoke('checkUpdates'),
  installUpdateAndQuit: () => ipcInvoke('installUpdateAndQuit')
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key)
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload)
  electron.ipcRenderer.on(key, cb)
  return () => electron.ipcRenderer.off(key, cb)
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key]
) {
  electron.ipcRenderer.send(key, payload)
}
