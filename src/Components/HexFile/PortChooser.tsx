import React, {useEffect, useState} from 'react';
import electron from 'electron';
import { List, Header, Dropdown, Message, Icon } from 'semantic-ui-react';

interface Option {
  key: number,
  text: string,
  value: any
}

const PortChooser = ({enabled, onDone}: {enabled: boolean, onDone: () => void}) => {

  const [ports, setPorts] = useState<Option[]>([]);

  useEffect(() => {

    let mounted = true;

    electron.ipcRenderer.on('port-list-reply', (event, data) => {
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

    electron.ipcRenderer.send('port-list-request');
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
        text="Port"
        disabled={!enabled}
        icon={null}
        onChange={onDone}
        className={`icon ${enabled?'':'in'}active-btn step-btn button`}
        floating
        scrolling
      >
        <Dropdown.Menu>
          <Message
            error
            className="error-port-message"
            header="Error"
            content="No ports found."
          />
        </Dropdown.Menu>
      </Dropdown>
    </List.Item>
  );
};

export default PortChooser;
