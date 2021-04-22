/* eslint-disable @typescript-eslint/naming-convention */

const axios = require('axios');
const { ipcMain, app } = require('electron');
const _ = require('underscore');
const { update_faq, update_hex_file, devices_list_request, kill_avrdude, sensors_list_request, faq_content,
        faq_content_error, hex_file_content, hex_content_error } = require('../constants');

import flasher from './Flasher';

 /*

   Communication with frontend.
   Events defined to perform actions
   basing on frontend signals.

 */

ipcMain.on(update_faq, (event, data) => {
  axios.get(flasher.serverlessAssistantUrl + `/faq/wizard`)
    .then((response) => {
      //console.log("FAQ response: ", response.data)
      event.sender.send(faq_content, response.data);
    })
    .catch((error) => {
      event.sender.send(faq_content_error);
    });
});
ipcMain.on(update_hex_file, (event, data) => {
  axios.get(flasher.serverlessAssistantUrl+ `/hexfileprinters`)
    .then((response) => {
      //console.log("FAQ response: ", response.data)
      event.sender.send(hex_file_content, response.data);
    })
    .catch((error) => {
      event.sender.send(hex_content_error);
    });
});

ipcMain.on(devices_list_request, async (event, arg) => {
  axios.get(flasher.serverlessAssistantUrl+ '/nohexfileprinters')
    .then((response) => {
      flasher.devicesTable = response.data
      const devices = response.data.map(e=>e.name)
      event.sender.send('dropdown-devices-content', {
        dropdown: 'processors',
        content: devices,
      });
    })
    .catch((error) => {
      console.log(error);
      event.sender.send('wizard-assistant-error');
    });
});
ipcMain.on(kill_avrdude, async (event) => {
  flasher.killDudes(event);
});

ipcMain.on(sensors_list_request, async (event, arg) => {
  flasher.selectedOnlineConfiguration.device = arg;
  axios
    .get(flasher.serverlessAssistantUrl + `/getfirmwarestable`)
    .then((response) => {
      flasher.sensorsTable = response.data
      // flasher.config.baudrate = response.data['baudrate'];
      // flasher.config.processor = response.data['processor'];
      const selected = flasher.devicesTable.filter(e=>{if(e.name == arg)return true})[0]
      console.log(selected.features)
      flasher.config.baudrate = selected.baudrate;
      flasher.config.processor = selected.avrdude_preset;//TODO nwm czy to jest git
      event.sender.send('dropdown-sensors-content', {
        dropdown: 'sensors',
        content: selected.features,
      });
    })
    .catch((error) => {
      console.log(error);
      event.sender.send('wizard-assistant-error');
    });
  })
