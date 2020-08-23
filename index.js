'use strict';
const path = require('path');
const {app, BrowserWindow} = require('electron');
const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
require('dotenv').config();
const i18n = require('./js/i18n');
const isDev = require('electron-is-dev');

class WindowManager{
    constructor(){
        this.mainWindow;
        this.helpWindow;
        this.isHelpOpen = false;
    }
}
let windowManager = new WindowManager

unhandled();
debug();
//contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId('com.garage-makezone.flash-wizard');

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow;
let helpWindow;
let isHelpOpen = false;

let iconPath = (isDev)?'static/icon/wizzard.png': path.join(process.resourcesPath, "static/icon/wizzard.png")


/*

 Creating new windows.

*/
const createWelcomeWindow = async () => {
    const win = new BrowserWindow({
        title: "Flash Wizard",
        icon: iconPath,
        show: false,
        width: 740,
        height: 480,
        resizable: isDev ? true : false,
        webPreferences: {
            devTools: true,
            nodeIntegration: true
        }
    });
    win.setMenu(null)
    win.on('ready-to-show', () => {
        win.show();
    });

    win.on('closed', () => {
        // Dereference the window
        // For multiple windows store them in an array
        windowManager.mainWindow = undefined;
    });


    await win.loadFile(path.join(__dirname, 'welcome.html'));
    win.webContents.closeDevTools()
    return win;
};

const createHelpWindow = async () => {
    const win = new BrowserWindow({
        title: "Flash Wizard",
        icon: iconPath,
        show: false,
        width: 740,
        height: 480,
        resizable: isDev ? true : false,
        webPreferences: {
            devTools: true,
            nodeIntegration: true
        }
    });
    win.setMenu(null)

    win.on('ready-to-show', () => {
        win.show();
        windowManager.isHelpOpen = true;
    });

    win.on('closed', () => {
        // Dereference the window
        // For multiple windows store them in an array
        windowManager.isHelpOpen = false;
        windowManager.helpWindow = null;
    });

    await win.loadFile(path.join(__dirname, 'help.html'));
    win.webContents.closeDevTools()
    return win;
};

/*

Handling app signals,
closing and opening windows,
handling external events.

*/

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
    app.quit();
}

// Restore already opened window when somebody tries to open second app instance
app.on('second-instance', () => {
    if (windowManager.mainWindow) {
        if (windowManager.mainWindow.isMinimized()) {
            windowManager.mainWindow.restore();
        }

        windowManager.mainWindow.show();
    }
});

// No windows opened? Close app.
app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// Create window on attempt of activation the app.
// For ex. when taskbar or dock icon clicked
// or application's gonna be relaunched when it's running
app.on('activate', async () => {
    if (!windowManager.mainWindow) {
        windowManager.mainWindow = await createWelcomeWindow();
    }
});

// Create first welcome screen when app is ready.
(async () => {
	await app.whenReady();
    windowManager.mainWindow = await createWelcomeWindow();
 
})();


require('./js/backend-events')(windowManager, createHelpWindow)


/*

Autoupdater module.

*/

// autoUpdater.requestHeaders = { "PRIVATE-TOKEN": "Personal access Token" };
// autoUpdater.autoDownload = true;
// 
// autoUpdater.setFeedURL({
//     provider: "generic",
//     url: "https://gitlab.com/gerwant/flash-wizard"
// });
// 
// autoUpdater.on('checking-for-update', function () {
//     sendStatusToWindow('Checking for update...');
// });
// 
// autoUpdater.on('update-available', function (info) {
//     sendStatusToWindow('Update available.');
// });
// 
// autoUpdater.on('update-not-available', function (info) {
//     sendStatusToWindow('Update not available.');
// });
// 
// autoUpdater.on('error', function (err) {
//     sendStatusToWindow('Error in auto-updater.');
// });
// 
// autoUpdater.on('download-progress', function (progressObj) {
//     sendStatusToWindow('Update downloaded; will install in 1 seconds');
//     let log_message = "Download speed: " + progressObj.bytesPerSecond;
//     log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
//     log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
//     sendStatusToWindow(log_message);
// });
// 
// autoUpdater.on('update-downloaded', function (info) {
//     sendStatusToWindow('Update downloaded; will install in 1 seconds');
// });

// autoUpdater.on('update-downloaded', function (info) {
//     setTimeout(function () {
//         autoUpdater.quitAndInstall();
//     }, 1000);
// });

// autoUpdater.checkForUpdates();

// function sendStatusToWindow(message) {
//     console.log(message);
// }