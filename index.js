'use strict';
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
//const contextMenu = require('electron-context-menu');
const config = require('./js/config');
require('dotenv').config();
const SerialPort = require('serialport');
const { list } = require('serialport');
const i18n = require('./js/i18n');
const spawn = require('child_process').spawn;
const isDev = require('electron-is-dev');
const ftp = require('basic-ftp');
const _ = require('underscore');


var flash_config = {
    port: null,
    file_path: null,
    baudrate: 57600,
    processor: null
}


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

// FTP connection
const client = new ftp.Client();
client.ftp.verbose = true;

/*

 Creating new windows.

*/

const createMainWindow = async () => {
    const win = new BrowserWindow({
        title: "Flash Wizard",
        icon: iconPath,
        show: false,
        width: 740,
        height: 480,
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
        mainWindow = undefined;
    });

    await win.loadFile(path.join(__dirname, 'index.html'));

    return win;
};

const createNohexWindow = async () => {
    const win = new BrowserWindow({
        title: "Flash Wizard",
        icon: iconPath,
        show: false,
        width: 740,
        height: 480,
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
        mainWindow = undefined;
    });

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false
        })
        
    } catch(err) {
        // Should terminate window and return to welcome window
        // with appropriate error message
        console.log(err)
    }

    await win.loadFile(path.join(__dirname, 'nohex.html'));

    return win;
};

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
        mainWindow = undefined;
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
        isHelpOpen = true;
    });

    win.on('closed', () => {
        // Dereference the window
        // For multiple windows store them in an array
        isHelpOpen = false;
        helpWindow = null;
    });

    await win.loadFile(path.join(__dirname, 'help.html'));
    win.webContents.closeDevTools()
    return win;
};

/*

End of creating windows.

*/

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
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }

        mainWindow.show();
    }
});

// No windows opened? Close app.
app.on('window-all-closed', () => {
    if (process.platform === "darwin") {
        app.quit();
    }
});

// Create window on attempt of activation the app.
// For ex. when taskbar or dock icon clicked
// or application's gonna be relaunched when it's running
app.on('activate', async () => {
    if (!mainWindow) {
        mainWindow = await createWelcomeWindow();
    }
});

// Create first welcome screen when app is ready.
(async () => {
	await app.whenReady();
    mainWindow = await createWelcomeWindow();
 
})();

/*

Communication with frontend.
Events defined to perform actions 
basing on frontend signals.

*/

ipcMain.on('devices-list-request', async (event, arg) => {
    let listing = await client.list()
    listing = _.filter(listing, (element)=>{
        return element.type == 2; // 2 because type 2 means it's a directory
    })
    listing = _.map(listing, (element) => {
        return element.name;
    })
    console.log(listing)
    event.sender.send('dropdown-content', {dropdown: "processors", content: listing})
})

ipcMain.on('perform-flash', (event, arg) => {
    const avrdude_exec = (process.platform === "win32") ? 'avrdude.exe' : 'avrdude'

    let avrdude_path = ''
    let avrdude_config_path = ''
    if(isDev){
        avrdude_path = path.join(__dirname, 'bin/')+avrdude_exec;
        avrdude_config_path = path.join(__dirname, 'bin/')+'avrdude.conf'
    } else {
        avrdude_path = path.join(process.resourcesPath, "bin/")+avrdude_exec;
        avrdude_config_path = path.join(process.resourcesPath, 'bin/')+'avrdude.conf' //process.resourcesPath
    }
    console.log(avrdude_path)
    const avrdude_args = [
        '-C'+avrdude_config_path,
        '-p'+flash_config.processor,
        '-carduino',
        '-P'+flash_config.port,
        '-b'+flash_config.baudrate,
        '-D',
        '-Uflash:w:'+flash_config.file_path+':i'
    ]
    let child = null;
    if (process.platform === "win32"){
        child = spawn('cmd.exe', ['/c', avrdude_path].concat(avrdude_args))
    } else {
        child = spawn(avrdude_path, avrdude_args);
    }

    child.stdout.on('data', (data) => {
        let datastring = data.toString()
        console.log('stdout: ', datastring);
        if (datastring.includes('avrdude done')||datastring.includes('avrdude.exe done')){
            event.sender.send('avrdude-done', datastring)
        } else {
            event.sender.send('avrdude-response', datastring)
        }
    })

    child.stderr.on('data', (data) => {
        let datastring = data.toString()
        console.log('stderr: ',datastring);
        if (datastring.includes('avrdude done')||datastring.includes('avrdude.exe done')){
            event.sender.send('avrdude-done', datastring)
        } else {
            event.sender.send('avrdude-response', datastring)
        }
    })

    child.on('error', (err) => {
        console.log("ERROR DURING STARTUP", err);
        event.sender.send('avrdude-done', null)
    })
})

ipcMain.on('port-list-request', function (event, arg) {
    function listPorts() {
        let list_ports = []
        SerialPort.list().then(
         ports => {
            
             event.sender.send('port-list-reply', ports);
            },
         err => {
          console.error('Error listing ports', err)
         }
        )
       }
       
      listPorts()
     
    })
     
ipcMain.on('send-config-request', function (event, value, field) {
    flash_config[field] = value

})

ipcMain.on('change-language-request', function (event, atr) {
    i18n.changeLanguage(atr)
    mainWindow.reload()
})

ipcMain.on('openMainWindow', function (event, atr) {
    (async () => {
        mainWindow.loadFile('index.html')
        //let welcome_window = mainWindow
        //console.log(mainWindow)
        //mainWindow = await createMainWindow();
        //console.log(mainWindow)
     
    })();
})

ipcMain.on('openNohexWindow', function(e, atr) {
    (async () => {
        mainWindow.loadFile('nohex.html')
        //let nohex_window = mainWindow
        //mainWindow = await createNohexWindow();
        //nohex_window.close();
    })();
})

ipcMain.on('openHelpWindow', function (event, atr) {
    (async () => {
        if (isHelpOpen){
            return;
        } else {
            helpWindow = await createHelpWindow();     
        }
    })();
})

ipcMain.on('goToWelcome', function (event, atr) {
    (async () => {
        //let backWindow = mainWindow
        //console.log(mainWindow)
        //mainWindow = await createWelcomeWindow();
        mainWindow.loadFile('welcome.html')
    })();
})

ipcMain.on('close-help-window', function (event, atr) {
    (async () => {
 
        helpWindow.close()
        isHelpOpen = false
    })();
})
/* 

End of communication with frontend.

*/

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