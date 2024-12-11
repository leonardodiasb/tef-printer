import { app, BrowserWindow } from 'electron';
import path from 'path';

app.on('ready', () => {
  console.log("ASDF")
  const mainWindow = new BrowserWindow({});
  mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
});