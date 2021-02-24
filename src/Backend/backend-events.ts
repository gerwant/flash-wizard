/* eslint-disable @typescript-eslint/naming-convention */
import { BrowserWindow } from 'electron';

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

let child = null;
let flash_config = {
  port: null,
  file_path: null,
  baudrate: null,
  processor: null,
};

let hexpath_config = {
  device: null,
  sensor: null,
};

let wizzardAssistant = 'http://vm1.garage-makezone.eu:3000';

let avrdude_ids = [];

module.exports = function (windowManager) {
  /*

    Communication with frontend.
    Events defined to perform actions 
    basing on frontend signals.

  */

  ipcMain.on('port-list-request', function (event, arg) {
    function listPorts() {
      const list_ports = [];
      SerialPort.list().then(
        (ports) => {
          console.log(ports);
          
          ports = _.filter(ports, (element) => {
            // This solution seems to be good as long as all motherboards will have signed USB drivers
            if (element.vendorId || element.productId) {
              return true;
            }

            return false;
          });
          console.log(ports);
          event.sender.send('port-list-reply', ports);
        },
        (err) => {
          console.error('Error listing ports', err);
        }
      );
    }

    listPorts();
  });

  ipcMain.on('perform-flash', (event, arg) => {
    // const avrdude_exec = (process.platform === "win32") ? 'avrdude.exe' : 'avrdude'
    let avrdude_exec;
    if (process.platform === 'win32') {
      avrdude_exec = 'avrdude.exe';
    } else if (process.arch === 'x64') {
      avrdude_exec = 'avrdude';
    } else {
      avrdude_exec = 'x32avrdude';
    }

    let avrdude_path = '';
    let avrdude_config_path = '';
    if (isDev) {
      avrdude_path = path.join(__dirname, '../bin/') + avrdude_exec;
      avrdude_config_path = path.join(__dirname, '../bin/') + 'avrdude.conf';
    } else {
      avrdude_path = path.join(process.resourcesPath, 'bin/') + avrdude_exec;
      avrdude_config_path =
        path.join(process.resourcesPath, 'bin/') + 'avrdude.conf'; //process.resourcesPath
    }

    const avrdude_args = [
      '-v',
      '-C' + avrdude_config_path,
      '-p' + flash_config.processor,
      '-carduino',
      '-P' + flash_config.port,
      '-b' + flash_config.baudrate,
      '-D',
      '-Uflash:w:' + flash_config.file_path + ':i',
    ];
    if (process.platform === 'win32') {
      child = spawn('cmd.exe', ['/c', avrdude_path].concat(avrdude_args));
    } else {
      child = spawn(avrdude_path, avrdude_args);
    }

    avrdude_ids.push(child.pid);

    child.stdout.on('data', (data) => {
      let datastring = data.toString();
      console.log('stdout: ', datastring);
      if (
        datastring.includes('avrdude done') ||
        datastring.includes('avrdude.exe done') ||
        datastring.includes('stk500_cmd') ||
        datastring.includes('out of sync')
      ) {
        event.sender.send('avrdude-done', datastring);
      } else {
        event.sender.send('avrdude-response', datastring);
      }
    });

    child.stderr.on('data', (data) => {
      let datastring = data.toString();
      console.log('stderr: ', datastring);
      if (
        datastring.includes('avrdude done') ||
        datastring.includes('avrdude.exe done') ||
        datastring.includes('stk500_cmd') ||
        datastring.includes('out of sync') ||
        datastring.includes('stk500v2_ReceiveMessage')
      ) {
        event.sender.send('avrdude-done', datastring);
        killDudes(event);
      } else {
        event.sender.send('avrdude-response', datastring);
      }
    });

    child.on('error', (err) => {
      console.log('ERROR DURING STARTUP', err);
      event.sender.send('avrdude-done', null);
    });
  });

  function killDudes(event) {
    _.each(avrdude_ids, (proc) => {
      kill(proc, 'SIGKILL', (error) => {
        if (error) {
          console.log('Well, not killed.', error);
          //event.sender.send('avrdude-done', "Aborting failed.")
        } else {
          idx = _.indexOf(avrdude_ids, proc);
          avrdude_ids.splice(idx, 1);
          event.sender.send('avrdude-done', 'Flashing aborted');
        }
      });
    });
  }

  ipcMain.on('send-config-request', function (event, value, field) {
    flash_config[field] = value;
    console.log(flash_config);
  });

  ipcMain.on('download-hex', (event, filename) => {
    let hex_path = isDev
      ? path.join(__dirname, '../')
      : app.getPath('userData');
    flash_config.file_path = path.join(hex_path, 'firmware.hex');

    let link = `http://gmz.webd.pro/firmwares/no_hex_file/${hexpath_config.device}/${hexpath_config.sensor}/${filename}`;
    fs.unlink(path.join(hex_path, 'firmware.hex'), function (err) {
      if (err && err.code == 'ENOENT') {
        // file doens't exist
        console.info("File doesn't exist, won't remove it.");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error('Error occurred while trying to remove file');
      } else {
        console.info(`removed`);
      }
    });

    let options = {
      directory: hex_path,
      filename: 'firmware.hex',
    };

    download(link, options, function (err) {
      if (err) {
        event.sender.send('hex-download-fail');
      } else {
        event.sender.send('hex-downloaded');
      }
    });
  });

  ipcMain.on('update-sensor', (event, data) => {
    hexpath_config.sensor = data.sensor;

    axios
      .get(
        wizzardAssistant +
          `/dev/${hexpath_config.device}/${hexpath_config.sensor}`
      )
      .then((response) => {
        event.sender.send('language-popup', {
          files: response.data['devices'],
        });
      })
      .catch((error) => {
        event.sender.send('wizard-assistant-error');
      });
  });

  ipcMain.on('update-faq', (event, data) => {
    axios
      .get(wizzardAssistant + `/faq`)
      .then((response) => {
        //console.log("FAQ response: ", response.data)
        event.sender.send('faq-content', response.data);
      })
      .catch((error) => {
        event.sender.send('faq-content-error');
      });
  });

  ipcMain.on('update_hex_file', (event, data) => {
    axios
      .get(wizzardAssistant + `/hex_file`)
      .then((response) => {
        //console.log("FAQ response: ", response.data)
        event.sender.send('hex_file_content', response.data);
      })
      .catch((error) => {
        event.sender.send('hex_content_error');
      });
  });

  ipcMain.on('openMainWindow', function (event, atr) {
    (async () => {
      windowManager.mainWindow.loadFile('index.html');
    })();
  });

  ipcMain.on('openNohexWindow', function (e, atr) {
    (async () => {
      windowManager.mainWindow.loadFile('nohex.html');
    })();
  });

  ipcMain.on('openHelpWindow', function (event, atr) {
    (async () => {
      if (windowManager.isHelpOpen) {
        return;
      } else {
        windowManager.helpWindow = await createHelpWindow();
      }
    })();
  });

  ipcMain.on('close-update-win', function (event, atr) {
    if (windowManager.updateWindow) {
      windowManager.updateWindow.close();
    }
  });

  ipcMain.on('goToWelcome', function (event, atr) {
    (async () => {
      windowManager.mainWindow.loadFile('welcome.html');
    })();
  });

  ipcMain.on('close-help-window', function (event, atr) {
    (async () => {
      windowManager.helpWindow.close();
      windowManager.isHelpOpen = false;
    })();
  });

  ipcMain.on('devices-list-request', async (event, arg) => {
    axios
      .get(wizzardAssistant + '/devices')
      .then((response) => {
        event.sender.send('dropdown-content', {
          dropdown: 'processors',
          content: response.data['devices'],
        });
      })
      .catch((error) => {
        console.log(error);
        event.sender.send('wizard-assistant-error');
      });
  });
  ipcMain.on('kill_avrdude', async (event) => {
    console.log(avrdude_ids);

    killDudes(event);
  });

  ipcMain.on('sensors-list-request', async (event, arg) => {
    hexpath_config.device = arg.device;
    axios
      .get(wizzardAssistant + `/${hexpath_config.device}`)
      .then((response) => {
        flash_config.baudrate = response.data['baudrate'];
        flash_config.processor = response.data['processor'];
        event.sender.send('dropdown-content', {
          dropdown: 'sensors',
          content: response.data['sensors'],
        });
      })
      .catch((error) => {
        console.log(error);
        event.sender.send('wizard-assistant-error');
      });
  });
};
