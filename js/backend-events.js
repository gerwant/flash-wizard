const SerialPort = require('serialport');
const isDev = require('electron-is-dev')
const i18n = require('./i18n')
const FTPClient = require('ftp');
const axios = require('axios');
const path = require('path');
const spawn = require('child_process').spawn;
const fs = require('fs');
const config = require('./config');
const {ipcMain} = require('electron')
const electron = require('electron')
const _ = require('underscore')

var flash_config = {
    port: null,
    file_path: null,
    baudrate: 57600,
    processor: null
}

var hexpath_config = {
    device: null,
    sensor: null
}

var wizzardAssistant = "http://localhost:3000"
// FTP connection
const client = new FTPClient();
const excluded_dirs = ['.', '..']

async function connectFTP(){
    
    try {
        client.connect({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false
        })

        return true
        
    } catch(err) {
        // Should terminate window and return to welcome window
        // with appropriate error message
        console.log("FTP ERROR: ", err)
        return false
    }
}


module.exports = function(windowManager, createHelpWindow){
    /*

    Communication with frontend.
    Events defined to perform actions 
    basing on frontend signals.

    */

    ipcMain.on('change-language-request', function (event, atr) {
        i18n.changeLanguage(atr)
        windowManager.mainWindow.reload()
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
             });
           };
           
          listPorts()
         
        });
    
        
    ipcMain.on('perform-flash', (event, arg) => {
        const avrdude_exec = (process.platform === "win32") ? 'avrdude.exe' : 'avrdude'
    
        let avrdude_path = ''
        let avrdude_config_path = ''
        if(isDev){
            avrdude_path = path.join(__dirname, '../bin/')+avrdude_exec;
            avrdude_config_path = path.join(__dirname, '../bin/')+'avrdude.conf'
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
        console.log(avrdude_args)
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

    ipcMain.on('send-config-request', function (event, value, field) {
        flash_config[field] = value
    })
    
    ipcMain.on('update-sensor', (event, data)=> {
        hexpath_config.sensor = data.sensor;
        let link = `http://gmz.webd.pro/firmwares/${hexpath_config.device}/${hexpath_config.sensor}/firmware.hex`
        electron.shell.openExternal(link)

    })

    ipcMain.on('openMainWindow', function (event, atr) {
        (async () => {
            windowManager.mainWindow.loadFile('index.html')
        })();
    })

    ipcMain.on('openNohexWindow', function(e, atr) {
        (async () => {
            await connectFTP();
            windowManager.mainWindow.loadFile('nohex.html')
        })();
    })
    
    ipcMain.on('openHelpWindow', function (event, atr) {
        (async () => {
            if (windowManager.isHelpOpen){
                return;
            } else {
                windowManager.helpWindow = await createHelpWindow();     
            }
        })();
    })

    ipcMain.on('goToWelcome', function (event, atr) {
        (async () => {
            windowManager.mainWindow.loadFile('welcome.html')
        })();
    })

    ipcMain.on('close-help-window', function (event, atr) {
        (async () => {
            windowManager.helpWindow.close()
            windowManager.isHelpOpen = false
        })();
    })

    ipcMain.on('devices-list-request', async (event, arg) => {
        axios.get(wizzardAssistant + "/devices")
        .then(response => {
          event.sender.send('dropdown-content', {dropdown: "processors", content: response.data["devices"]})
        })
        .catch(error => {
          console.log(error);
        });
    })

    ipcMain.on('sensors-list-request', async (event, arg) => {
        hexpath_config.device = arg.device;
        axios.get(wizzardAssistant + `/${hexpath_config.device}`)
        .then(response => {
            flash_config.baudrate = response.data["baudrate"]
            flash_config.processor = response.data["processor"]
            event.sender.send('dropdown-content', {dropdown: "sensors", content: response.data["sensors"]})
        })
        .catch(error => {
          console.log(error);
        });
        
    })
        
}