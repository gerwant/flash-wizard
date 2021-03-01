import { autoUpdater } from 'electron-updater';
import log from 'electron-log'
import electron, {BrowserWindow, ipcMain} from 'electron'

export default class AppUpdater {
    constructor(win: BrowserWindow) {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
        autoUpdater.autoDownload = false;
        autoUpdater.allowDowngrade = true; //it has to be deleted later
        autoUpdater.setFeedURL({
          provider: "github",
          host: "github.com",
          repo: "flash-wizard",
          owner: "gerwant",
      });
      // function sendStatusToWindow(message: string) {
      //   console.log(message);
      // }
      ipcMain.on('download-update', (e, atr) => {
          autoUpdater.downloadUpdate && autoUpdater.downloadUpdate();
      })

      // autoUpdater.on('checking-for-update', function () {
      //     sendStatusToWindow('Checking for update...');
      // });

      autoUpdater.on('update-available', async (info) => {
        win.webContents.send('new-update')
      });


      // autoUpdater.on('error', function (err) {
      //     sendStatusToWindow('Error in auto-updater.');
      // });

      autoUpdater.on('download-progress', function (progressObj) {
          let log_message = "Download speed: " + progressObj.bytesPerSecond;
          log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
          log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
          //sendStatusToWindow(log_message);
          //windowManager.updateWindow.webContents.send('update-download-progress', log_message)
      });

      autoUpdater.on('update-downloaded', function (info) {
          console.log('Update downloaded. Now it is going to be installed')
          setTimeout(function () {
              autoUpdater.quitAndInstall();
          }, 300);
      });


      autoUpdater.checkForUpdates();
    }
}


