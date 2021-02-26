import React, {useState, useEffect} from 'react';
import { List, Icon, Header, Dropdown } from 'semantic-ui-react';
import electron from 'electron';

interface Option {
  key: number,
  text: string,
  valu: any
}

const DeviceChooser = ({enabled, hexfile}: {enabled: boolean, hexfile: boolean})  => {

  const [devices, setDevices] = useState<Option[]>([]);
  
  useEffect(() => { // That hook has to be inspected if unmounting works correctly and if ipcRenderer.on is properly used
    let mounted = true;

    console.log(electron.ipcRenderer.eventNames());
    
    electron.ipcRenderer.on('hex_file_content', (event, data) => {
      let opts: Option[] = [];
      const printers = data.printers;
      for (let i=0; i<printers.length;i++){
        opts.push({
          key: i,
          text: printers[i].name,
          valu: printers[i]
        })
      }
      console.log("lol");
      if (mounted){
        setDevices(opts);
      }
    })

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
        text="Devices"
        options={devices}
        disabled={!enabled}
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
