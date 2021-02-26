import React, {useState, useEffect} from 'react';
import electron from 'electron';
import { List, Header, Dropdown, Icon } from 'semantic-ui-react';

interface Option {
  key: number,
  text: string,
  value: any
}

const SensorChooser = ({enabled, onDone}: {enabled: boolean, onDone: () => void}) => {

    const shorten = (string: string) => {
      return (string.length>=15) ? string.substr(0,12) + '...' : string
    }

    const [sensors, setSensors] = useState<Option[]>([])
    const [ddLabel, setDDLabel] = useState("ABL")
    const [ddValue, setDDValue] = useState("ABL")

    const updateSensor = (ev, data) => {
      console.log("Selected sensor: ", data.value);

      let newLabel = shorten(data.value);

      setDDLabel(newLabel);
      setDDValue(data.value);

      electron.ipcRenderer.send('update-sensor', data.value);

      onDone();
    }

    const processSensors = (data) => {
      let opts: Option[] = [];
      const sens = data.content;

      for (let i=0; i<sens.length;i++){
        opts.push({
          key: i,
          text: sens[i],
          value: sens[i]
        })
      }
      console.log("Setting sensors, current label: ", ddLabel);
      setSensors(opts);
      setDDLabel("ABL");
      setDDValue('');
    }

    useEffect(() => {

      let mounted = true;

      electron.ipcRenderer.on('dropdown-sensors-content', (event, data) => {

        if (mounted){
          processSensors(data);
        }  

      })

      return ()=>{
        mounted = false;
        console.log("Unmounting", mounted)
        electron.ipcRenderer.removeListener('dropdown-sensors-content', () => {})
      }
    }, [])

    return (
    <List.Item className="step step2">
      <Icon disabled={!enabled} inverted name="syringe" size="big" className="step-icon syringe-icon" />
      <Header disabled={!enabled} as="h4" className="active-step-title noselect center">
        Choose ABL 
      </Header>
      <Dropdown
        text={ddLabel}
        disabled={!enabled}
        icon={null}
        options={sensors}
        value={ddValue}
        onChange={updateSensor}
        className={`icon ${enabled?'':'in'}active-btn step-btn button`}
        floating
        scrolling
      >
        
      </Dropdown>
    </List.Item>
    );

};

export default SensorChooser;