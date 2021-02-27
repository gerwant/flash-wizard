import React, {useState, useEffect, SyntheticEvent} from 'react';
import { List, Icon, Header, Dropdown } from 'semantic-ui-react';
import electron from 'electron';

const { sensors_list_request, send_config_request, dropdown_devices_content, update_hex_file, devices_list_request, hex_file_content } = require('../../constants');

interface Option {
  key: number,
  text: string,
  value: any
}

const DeviceChooser = ({enabled, hexfile, onDone}: {enabled: boolean, hexfile: boolean, onDone: () => void})  => {

  const [devices, setDevices] = useState<Option[]>([]);

  const [ddLabel, setDDLabel] = useState("Devices")

  const sendNoHexFileConfig = (ev, data) => {

    console.log("Selected item: ", data.value);

    let newLabel = (data.value.length>=15) ? data.value.substr(0,12) + '...' : data.value;

    setDDLabel(newLabel);

    electron.ipcRenderer.send(sensors_list_request, data.value);

    onDone();

  }

  const sendHexFileConfig = (ev, data) => {
    const selectedItem = JSON.parse(data.value);

    let newLabel = (selectedItem.name.length>=15) ? selectedItem.name.substr(0,12) + '...' : selectedItem.name;

    setDDLabel(newLabel);

    electron.ipcRenderer.send(send_config_request, JSON.parse(data.value));

    onDone();

  }
  
  useEffect(() => { // That hook has to be inspected if unmounting works correctly and if ipcRenderer.on is properly used
    let mounted = true;

    electron.ipcRenderer.on(hex_file_content, (event, data) => {
      let opts: Option[] = [];
      const printers = data.printers;
      for (let i=0; i<printers.length;i++){
        opts.push({
          key: i,
          text: printers[i].name,
          value: JSON.stringify(printers[i])
        })
      }
      if (mounted){
        setDevices(opts);
      }
    })

    electron.ipcRenderer.on(dropdown_devices_content, (event, data) => {
      const devices = data.content;
      let opts: Option[] = [];
      for (let i=0; i<devices.length;i++){
          opts.push({
            key: i,
            text: devices[i],
            value: devices[i]
          })
      }
      if (mounted) {
        setDevices(opts);
      }
    });

    if (hexfile){
      electron.ipcRenderer.send(update_hex_file);
      console.log("Sent request for json content.");
    } else {
      electron.ipcRenderer.send(devices_list_request);
      console.log("Sent request for json content.");
    }

    return ()=>{
      mounted = false;
      console.log("Unmounting", mounted)
      electron.ipcRenderer.removeListener('hex_file_content', () => {})
    }
  }, [])

  return (
    <List.Item className="step step1">
      <Icon disabled={!enabled} inverted name="microchip" size="big" className="step-icon" />
      <Header disabled={!enabled} as="h4" className={`active-step-title noselect center`}>
        Choose device
      </Header>
      <Dropdown
        text={ddLabel}
        options={devices}
        disabled={!enabled}
        onChange={hexfile? sendHexFileConfig : sendNoHexFileConfig}
        icon={null}
        className={`icon ${enabled?'active-btn':'inactive-btn'} step-btn button`}
        floating
        scrolling
      />
        {/*<Dropdown.Menu>
          <Dropdown.Item text="Test" />
          <Dropdown.Item text="Test" />
          <Dropdown.Item text="Test" />
        </Dropdown.Menu>
        </Dropdown> */}
    </List.Item>
  );
};

export default DeviceChooser;
