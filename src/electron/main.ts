import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { ipcMainHandle, isDev } from './utils.js';
import { getStaticData, poolResource } from './resourceManager.js';
import { getPreloadPath } from './pathResolver.js';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath()
    }
  });
  if(isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
  }
  poolResource(mainWindow);

  ipcMainHandle('getStaticData', () => {
    return getStaticData();
  })
});
