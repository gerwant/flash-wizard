const {ipcMain, app} = require('electron')
const { autoUpdater }= require("electron-updater");
const isDev = require('electron-is-dev');

autoUpdater.autoDownload = false;

module.exports = function(windowManager, createUpdateWindow) {
        function sendStatusToWindow(message) {
            console.log(message);
        }

        autoUpdater.setFeedURL({
            provider: "github",
            host: "github.com",
            repo: "flash-wizard",
            owner: "gerwant"
        });

        ipcMain.on('download-update', (e, atr) => {
            autoUpdater.downloadUpdate && autoUpdater.downloadUpdate();
        })

        autoUpdater.on('checking-for-update', function () {
            sendStatusToWindow('Checking for update...');
        });
 
        autoUpdater.on('update-available', async (info) => {
            sendStatusToWindow('Update available.');
            windowManager.updateWindow = await createUpdateWindow();
        });
 
        autoUpdater.on('update-not-available', function (info) {
            sendStatusToWindow('Update not available.');
        });
 
        autoUpdater.on('error', function (err) {
            sendStatusToWindow('Error in auto-updater.');
        });
 
        autoUpdater.on('download-progress', function (progressObj) {
            let log_message = "Download speed: " + progressObj.bytesPerSecond;
            log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
            log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
            //sendStatusToWindow(log_message);
            windowManager.updateWindow.webContents.send('update-download-progress', log_message)
        });
 
        autoUpdater.on('update-downloaded', function (info) {
            console.log('Update downloaded. Now it is going to be installed')
            setTimeout(function () {
                autoUpdater.quitAndInstall();
            }, 300);
        }); 
}