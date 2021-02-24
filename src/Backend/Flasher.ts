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

class Flasher {

    avrdude_ids: number[] = [];
    assistantUrl: string = 'http://vm1.garage-makezone.eu:3000';
    child: any = null;

}