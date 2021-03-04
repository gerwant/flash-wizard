import React, {useEffect, useState} from 'react';
import electron from 'electron';
import { List, Header, Dropdown, Message, Icon } from 'semantic-ui-react';
import { update_flasher_port } from '../../constants';
import strings from '../../localization'

const { port_list_reply, port_list_request } = require('../../constants')

interface Option {
  key: number,
  text: string,
  value: any,
  disabled: boolean
}

const PortChooser = ({enabled, onDone}: {enabled: boolean, onDone: () => void}) => {

  const [selectedPort, setSelected] = useState(strings['Port'])
  const [ddValue, setDDValue] = useState('');
  const [ports, setPorts] = useState<Option[]>([]);

  const updatePort = (ev, data) => {

    electron.ipcRenderer.send(update_flasher_port, data.value);
    setDDValue(data.value);
    onDone();

  }

  useEffect(() => {

    let mounted = true;

    electron.ipcRenderer.on(port_list_reply, (event, data) => {
      let opts: Option[] = [];
      for (let i=0; i<data.length;i++){
        opts.push({
          key: i,
          text: data[i].path,
          value: data[i].path,
          disabled: false
        })
      }

      if(!data.length){
        opts.push({
          key: 0,
          text: strings["No ports"],
          value: "",
          disabled: true
        })
      }
      if (mounted){
        setDDValue('Port');
        setPorts(opts);
      }
    })

    electron.ipcRenderer.send(port_list_request);
    console.log("Sent request for list of COM ports.");

    return ()=>{
      mounted = false;
      console.log("Unmounting", mounted)
      electron.ipcRenderer.removeListener('port-list-reply', () => {})
    }

  }, [])

  return (
    <List.Item className="step step2">
      <Icon disabled={!enabled} inverted name="usb" size="big" className="step-icon" />
      <Header disabled={!enabled} as="h4" className="active-step-title noselect center">
        {strings["Choose port"]}
      </Header>
      <Dropdown
        text={ddValue?ddValue:strings['Port']}
        disabled={!enabled}
        icon={null}
        onChange={updatePort}
        options={ports}
        value={ddValue}
        className={`icon ${enabled?'':'in'}active-btn step-btn button`}
        floating
        scrolling
      >
        {/*   ports.length == 0 ?
        <Dropdown.Menu>
          <Message
            error
            className="error-port-message"
            header="Error"
            content="No ports found."
          />
        </Dropdown.Menu>
        : null */}
      </Dropdown>
    </List.Item>
  );
};

export default PortChooser;
