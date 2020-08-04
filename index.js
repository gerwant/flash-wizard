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
const spawn = require('child_process').spawn;

var flash_config = {
    port: null,
    file_path: null,
    baudrate: null,
    processor: null
}

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

    // TODO: uncomment when ready to publish, only for development purposes needed
    //win.setResizable(false);


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
    
	//const favoriteAnimal = config.get('favoriteAnimal');
	//mainWindow.webContents.executeJavaScript(`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`);
})();

ipcMain.on('perform-flash', (event, arg) => {
    const avrdude_exec = (process.platform === "win32") ? 'avrdude.exe' : 'avrdude'

    let avrdude_path = ''
    let avrdude_config_path = ''
    if(process.env.NODE_ENV == "development"){
        avrdude_path = path.join(__dirname, 'bin/')+avrdude_exec;
        avrdude_config_path = path.join(__dirname, 'bin/')+'avrdude.conf'
    } else {
        avrdude_path = path.join(process.resourcesPath, "bin/")+avrdude_exec;
        avrdude_config_path = path.join(process.resourcesPath, 'bin/')+'avrdude.conf'
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
        child = spawn('cmd', ['/c'].concat(avrdude_args))
    } else {
        child = spawn(avrdude_path, avrdude_args);
    }

    child.stdout.on('data', (data) => {
        console.log('stdout: ', data.toString());
        if (data.toString().includes('avrdude done')){
            event.sender.send('avrdude-done', data.toString())
        } else {
            event.sender.send('avrdude-response', data.toString())
        }
    })

    child.stderr.on('data', (data) => {
        console.log('stderr: ',data.toString());
        if (data.toString().includes('avrdude done')){
            event.sender.send('avrdude-done', data.toString())
        } else {
            event.sender.send('avrdude-response', data.toString())
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

    console.log("flash config;\n", flash_config)

})

//ipcMain.on('send-port-request', function (event, arg) {
//    flash_config.port = arg
//
//    console.log("flash config;\n", flash_config)
//
//})


