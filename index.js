'use strict';
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
/// const {autoUpdater} = require('electron-updater');
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const config = require('./js/config');
const menu = require('./js/menu');
const SerialPort = require('serialport');
const { list } = require('serialport');

unhandled();
debug();
contextMenu();

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

const createMainWindow = async () => {
    const win = new BrowserWindow({
        title: app.name,
        show: false,
        width: 640,
        height: 480,
        webPreferences: {
            devTools: true,
            nodeIntegration: true
        }
    });

    win.on('ready-to-show', () => {
        win.show();
    });

    win.on('closed', () => {
        // Dereference the window
        // For multiple windows store them in an array
        mainWindow = undefined;
    });

    await win.loadFile(path.join(__dirname, 'index.html'));

    return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
    app.quit();
}

app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }

        mainWindow.show();
    }
});

app.on('window-all-closed', () => {
    if (!is.macos) {
        app.quit();
    }
});

app.on('activate', async () => {
    if (!mainWindow) {
        mainWindow = await createMainWindow();
    }
});

(async () => {
	await app.whenReady();
	Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();

	const favoriteAnimal = config.get('favoriteAnimal');
	//mainWindow.webContents.executeJavaScript(`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`);
})();

function listPorts() {
    SerialPort.list().then(
     ports => { console.log("Liczba portow:",ports.length)
      ports.forEach(port => {
       console.log(`${port.comName}\t${port.pnpId || ''}\t${port.manufacturer || ''}`)
      })
     },
     err => {
      console.error('Error listing ports', err)
     }
    )
   }
   
listPorts()

  

ipcMain.on('port-list-request', function (event, arg) {
    function listPorts() {
        SerialPort.list().then(
         ports => {
          ports.forEach(port => {
           console.log(`${port.comName}\t${port.pnpId || ''}\t${port.manufacturer || ''}`)
          })
         },
         err => {
          console.error('Error listing ports', err)
         }
        )
       }
       
    listPorts()

      
    //   event.sender.send('port-list-reply', "sdadsdasdasdasd");
     
    })
     
	


