const SerialPort = require('serialport');
const isDev = require('electron-is-dev')
const i18n = require('./i18n')
const FTPClient = require('ftp');
const _ = require('underscore');
const path = require('path');
const spawn = require('child_process').spawn;
const fs = require('fs');
const config = require('./config');
const {ipcMain} = require('electron')

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
             }
            )
           }
           
          listPorts()
         
        })
    
        
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
        console.log(hexpath_config)
        if(hexpath_config.sensor && hexpath_config.device){

            fs.unlink('firmware.hex', function(err) {
                if(err && err.code == 'ENOENT') {
                    // file doens't exist
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    // other errors, e.g. maybe we don't have enough permission
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            });

            client.get(`/${hexpath_config.device}/${hexpath_config.sensor}/firmware.hex` , function(err, stream) {
                if (err) throw err;
                stream.pipe(fs.createWriteStream('firmware.hex'));
                event.sender.send("hex-downloaded")
            });
        }

    })

    ipcMain.on('openMainWindow', function (event, atr) {
        (async () => {
            windowManager.mainWindow.loadFile('index.html')
            //let welcome_window = mainWindow
            //console.log(mainWindow)
            //mainWindow = await createMainWindow();
            //console.log(mainWindow)
            
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
        if (!client){
            console.error('No ftp connection')
            return;
        }
        client.list('/', (err, listing) => {
            console.log(listing)
            listing = _.filter(listing, (element)=>{
                return element.type == 'd' && !excluded_dirs.includes(element.name); // 2 because type 2 means it's a directory
            })
            listing = _.map(listing, (element) => {
                return element.name;
            })
            console.log(listing)
            event.sender.send('dropdown-content', {dropdown: "processors", content: listing})
        })
        
    })

    ipcMain.on('sensors-list-request', async (event, arg) => {
        hexpath_config.device = arg.device;
        client.listSafe(`/${hexpath_config.device}`, (err, listing) =>{
            let procfile = _.find(listing, (el) => { return el.name.includes('.processor')}) // Look for .processor file
    
        
            if (procfile){
                flash_config.processor = procfile.name.split('.')[0]
                console.log(flash_config)
                let lst = _.filter(listing, (el) => { //Look for all directories meaning sensors
                    return el.type == 'd' && !excluded_dirs.includes(el.name);
                })
                lst = _.map(lst, (el) => { // Select only names of them
                    return el.name;
                })
                event.sender.send('dropdown-content', {dropdown: "sensors", content: lst})
            } else { // No .processor file means something went wrong and flash can't be performed
                event.sender.send('dropdown-content', {dropdown: "sensors", content: ''})
            }
            
        })
        
    })
        
}