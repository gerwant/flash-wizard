import path from 'path';
import {app, ipcMain, BrowserWindow, Menu} from 'electron';

import AppUpdater from './AppUpdater';

const isDev = require('electron-is-dev');

class WindowManager {

  mainWindow: BrowserWindow | null = null;

  installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload
      )
      .catch(console.log);
  };

  createWindow = async () => {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      await this.installExtensions();
    }

    const RESOURCES_PATH = app.isPackaged
      ? path.join(process.resourcesPath, 'resources')
      : path.join(__dirname, '../../assets');

    const getAssetPath = (...paths: string[]): string => {
      return path.join(RESOURCES_PATH, ...paths);
    };

    this.mainWindow = new BrowserWindow({
      title: 'Flash Wizard',
      show: false,
      width: 740,
      height: 480,
      resizable: isDev ? true : false,
      icon: getAssetPath('wizzard.png'),
      titleBarStyle: 'hidden',
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });

    this.mainWindow.loadURL(`file://${__dirname}/../index.html`);
    Menu.setApplicationMenu(null);

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    this.mainWindow.webContents.on('did-finish-load', () => {
      if (!this.mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        this.mainWindow.minimize();
      } else {
        this.mainWindow.show();
        this.mainWindow.focus();
      }
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Open urls in the user's browser
    // mainWindow.webContents.on('new-window', (event, url) => {
    //   event.preventDefault();
    //   shell.openExternal(url);
    // });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    new AppUpdater();
  };

}

const windowManager = new WindowManager();

ipcMain.on('reload', () => {
    if(windowManager.mainWindow != null){
      windowManager.mainWindow.reload();
    }
  });

ipcMain.on('change-language-request', function (event, atr) {
  i18n.changeLanguage(atr);
  if (windowManager.mainWindow != null){
    windowManager.mainWindow.reload();
  }
});

export default windowManager