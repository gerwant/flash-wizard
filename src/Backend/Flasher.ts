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
const { port_list_request, perform_flash, download_hex, update_sensor, avrdude_done, avrdude_response, port_list_reply,
        update_flasher_port, send_config_request, hex_download_fail, hex_downloaded, language_popup, wizard_assistant_error } = require('../constants');

interface FlasherConfig {
    port: any,
    filepath: string,
    baudrate: string,
    processor: string
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
                    event.sender.send(avrdude_done, 'Flashing aborted');
                }
            })
        })
    }

    run(event: any): void {
      const dudepreset = this.config.processor=='atmega2560'?'wiring':'arduino';
      const avrdude_args = [
        '-v',
        '-C' + this.avrdude_config_path,
        '-p' + this.config.processor,
        `-c${dudepreset}`,
        '-P' + this.config.port,
        '-b' + this.config.baudrate,
        '-D',
        '-Uflash:w:' + this.config.filepath + ':i',
      ];

      console.log(`Used avrdude preset: ${dudepreset}`);

      let child = null;
      if (process.platform === 'win32') {
        child = spawn('cmd.exe', ['/c', this.avrdude_path].concat(avrdude_args));
      } else {
        child = spawn(this.avrdude_path, avrdude_args);
      }

      this.avrdude_ids.push(child.pid);

      child.stdout.on('data', (data) => {
        let datastring = data.toString();
        console.log('stdout: ', datastring);
        if (
          datastring.includes('avrdude done') ||
          datastring.includes('avrdude.exe done') ||
          datastring.includes('stk500_cmd') ||
          datastring.includes('out of sync')
        ) {
          event.sender.send(avrdude_done, datastring);
        } else {
          event.sender.send(avrdude_response, datastring);
        }
      });

      child.stderr.on('data', (data: any) => {
        let datastring = data.toString();
        console.log('stderr: ', datastring);
        if (
          datastring.includes('avrdude done') ||
          datastring.includes('avrdude.exe done') ||
          datastring.includes('stk500_cmd') ||
          datastring.includes('out of sync') ||
          datastring.includes('stk500v2_ReceiveMessage')
        ) {
          event.sender.send(avrdude_done, datastring);
          this.killDudes(event);
        } else {
          event.sender.send(avrdude_response, datastring);
        }
      });

      child.on('error', (err: any) => {
        console.log('ERROR DURING STARTUP', err);
        event.sender.send(avrdude_done, null);
      });
      }

}

const flasher = new Flasher;

ipcMain.on(port_list_request, (event: any, arg: any) => {
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
        event.sender.send(port_list_reply, ports);
      },
      (err: any) => {
        console.error('Error listing ports', err);
      }
    );
});

ipcMain.on(perform_flash, (event, arg) => {
    flasher.run(event);
});

ipcMain.on(update_flasher_port, (event, arg) => {
  flasher.config.port = arg;
  console.log("Updated flasher config: ", flasher.config);
})

ipcMain.on(send_config_request, function (event: any, new_config: any) {
    flasher.config.baudrate = new_config.baudrate;
    flasher.config.processor = new_config.processor;
    console.log("Updated flasher config: ", flasher.config);
});

// TODO: Has to be replaced with string constant
ipcMain.on(download_hex, (event, filename) => {
    const hex_path = isDev ? path.join(__dirname, '../../') : app.getPath('userData');
    flasher.config.filepath = path.join(hex_path, 'firmware.hex');

    let link = `http://gmz.webd.pro/firmwares/no_hex_file/${flasher.selectedOnlineConfiguration.device}/${flasher.selectedOnlineConfiguration.sensor}/${filename}`;

    fs.unlink(path.join(hex_path, 'firmware.hex'), function (err) {
      if (err && (err.code == 'ENOENT')) {
        // file doens't exist
        console.info("File doesn't exist, won't delete it.");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error('Error occurred while trying to remove the file');
      } else {
        console.info(`firmware.hex deleted.`);
      }
    });

    let options = {
      directory: hex_path,
      filename: 'firmware.hex',
    };

    download(link, options, (err) => {
      if (err) {
        event.sender.send(hex_download_fail);
      } else {
        event.sender.send(hex_downloaded);
      }
    });
});

interface IStringDict {
  [id: string]: string;
}

ipcMain.on(update_sensor, (event: any, sensor: any) => {

    flasher.selectedOnlineConfiguration.sensor = sensor;

    axios.get( flasher.assistantUrl + `/dev/${flasher.selectedOnlineConfiguration.device}/${flasher.selectedOnlineConfiguration.sensor}` )
      .then((response: any) => {

        let langs: IStringDict = { pl: '', en: '', de: '', es: '', fr: '', it: '', pt: '', ru: '', cn: '' } 

        response.data['devices'].forEach((e: string) => {
            if ((e.charAt(e.length-7)!='_')||(e.slice(-3,e.length+1)!='hex')){
              return;
            }

            langs[e.slice(-6,-4).toLowerCase()] = e;
          }
        )
       
        event.sender.send(language_popup, langs); // {files: response.data['devices']}
      })
      .catch((error: any) => {
        event.sender.send(wizard_assistant_error);
      });
});

export default flasher;