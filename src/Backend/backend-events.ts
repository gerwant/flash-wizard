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

import flasher from './Flasher';

let wizzardAssistant = 'http://vm1.garage-makezone.eu:3000'; // implemented

let avrdude_ids = []; // implemented

  /*

    Communication with frontend.
    Events defined to perform actions 
    basing on frontend signals.

  */

  /*
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
  */


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

    flasher.killDudes(event);
  });

  ipcMain.on('sensors-list-request', async (event, arg) => {
    flasher.selectedOnlineConfiguration.device = arg.device;
    axios
      .get(wizzardAssistant + `/${flasher.selectedOnlineConfiguration.device}`)
      .then((response) => {
        flasher.config.baudrate = response.data['baudrate'];
        flasher.config.processor = response.data['processor'];
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
