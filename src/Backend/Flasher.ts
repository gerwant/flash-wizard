const SerialPort = require('serialport');
const isDev = require('electron-is-dev');
const axios = require('axios');
const path = require('path');
const spawn = require('child_process').spawn;
const { ipcMain, app } = require('electron');
const electron = require('electron');
const _ = require('underscore');
const download = require('download-file');
const fs = require('fs');
const kill = require('tree-kill');

interface FlasherConfig {
    [property: string]: any,
}

interface ISelectedConfiguration {
    device: string,
    sensor: string
}

class Flasher {

    avrdude_ids: number[] = [];
    assistantUrl: string = 'http://vm1.garage-makezone.eu:3000';
    child: any = null;
    avrdude_exec: string;
    avrdude_path: string;
    avrdude_config_path: string;
    config: FlasherConfig = {
        port: '',
        filepath: '',
        baudrate: '',
        processor: ''
    };
    selectedOnlineConfiguration: ISelectedConfiguration;
    
    constructor() {

        // Default config
        this.config = {
            port: null,
            filepath: '',
            baudrate: '',
            processor: ''
        }

        this.selectedOnlineConfiguration = {
            device: '',
            sensor: ''
        }

        // Avrdude executable selector
        if (process.platform === 'win32') {
          this.avrdude_exec = 'avrdude.exe';
        } else if (process.arch === 'x64') {
          this.avrdude_exec = 'avrdude';
        } else {
          this.avrdude_exec = 'x32avrdude';
        }

        // Avrdude executable and config path selector
        if (isDev) {
            this.avrdude_path = path.join(__dirname, '../bin/') + this.avrdude_exec;
            this.avrdude_config_path = path.join(__dirname, '../bin/') + 'avrdude.conf';
        } else {
            this.avrdude_path = path.join(process.resourcesPath, 'bin/') + this.avrdude_exec;
            this.avrdude_config_path =
              path.join(process.resourcesPath, 'bin/') + 'avrdude.conf'; //process.resourcesPath
        }                   
    }

    killDudes(event: any): void {
        _.each(this.avrdude_ids, (proc: number | any) => {
            kill(proc, 'SIGKILL', (error: any) => {                    
                if (error){
                    console.log("Well, not killed.");
                } else {
                    let idx = _.indexOf(this.avrdude_ids, proc);
                    this.avrdude_ids.splice(idx, 1);
                    event.sender.send('avrdude-done', 'Flashing aborted'); // TODO: Has to be replaced with string constant
                }
            })
        })
    }

    run(): void {

    }

}

const flasher = new Flasher;

ipcMain.on('port-list-request', (event: any, arg: any) => {
    SerialPort.list().then(
      (ports: any) => {
        console.log(ports);
        
        ports = _.filter(ports, (element: any) => {
          // This solution seems to be good as long as all motherboards will have signed USB drivers
          if (element.vendorId || element.productId) {
            return true;
          }

          return false;
        });
        console.log(ports);
        event.sender.send('port-list-reply', ports);
      },
      (err: any) => {
        console.error('Error listing ports', err);
      }
    );
});

// TODO: Has to be replaced with string constant
ipcMain.on('perform-flash', (event, arg) => {
    flasher.run();
});

// TODO: Has to be replaced with string constant
ipcMain.on('send-config-request', function (event: any, value: string, field: any) {
    flasher.config[field] = value;
    console.log("Updated flasher config: ", flasher.config);
});

ipcMain.on('download-hex', (event, filename) => {
    const hex_path = isDev ? path.join(__dirname, '../../') : app.getPath('userData');
    flasher.config.filepath = path.join(hex_path, 'firmware.hex');
});