import React, {useEffect, useState} from 'react';
import electron from 'electron';
import { List, Header, Dropdown, Message, Icon } from 'semantic-ui-react';


const { port_list_reply, port_list_request } = require('../../constants')

interface Option {
  key: number,
  text: string,
  value: any
}

const PortChooser = ({enabled, onDone}: {enabled: boolean, onDone: () => void}) => {

  const [selectedPort, setSelected] = useState('Port')
  const [ports, setPorts] = useState<Option[]>([]);

  useEffect(() => {

    let mounted = true;

    electron.ipcRenderer.on(port_list_reply, (event, data) => {
      let opts: Option[] = [];
      for (let i=0; i<data.length;i++){
        opts.push({
          key: i,
          text: data[i].path,
          value: data[i].path
        })
      }
      if (mounted){
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
        Choose port
      </Header>
      <Dropdown
        text={selectedPort}
        disabled={!enabled}
        icon={null}
        onChange={onDone}
        options={ports.length == 0 ? [] : ports}
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
