import React, {useState, useEffect} from 'react';
import electron from 'electron';
import { List, Header, Dropdown, Icon } from 'semantic-ui-react';
import strings from '../../localization'

import  SensorSVG from './sensor.svg';

const { update_sensor, dropdown_sensors_content } = require('../../constants')

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

      electron.ipcRenderer.send(update_sensor, data.value);

      onDone();
    }

    const processSensors = (data) => {
      let opts: Option[] = [];
      const sens = data.content;

      for (let i=0; i<sens.length;i++){
        opts.push({
          key: i,
          text: sens[i].feature,
          value: sens[i].feature
        })
      }
      console.log("Setting sensors, current label: ", ddLabel);
      setSensors(opts);
      setDDLabel("ABL");
      setDDValue('');
    }

    useEffect(() => {

      let mounted = true;

      electron.ipcRenderer.on(dropdown_sensors_content, (event, data) => {

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

      <svg id="Capa_1" className="syringe-icon" style={{marginBottom: "-4px", marginLeft: "-2px"}} enable-background="new 0 0 512 512" height="37" viewBox="0 0 512 512" width="37" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path style={{fill: `${enabled?"white":"rgb(148,150,156)"}`}} d="m282.607 53.393c-5.857-5.858-15.355-5.858-21.213 0s-5.858 15.355 0 21.213l29.393 29.394-46.787 46.787 117.213 117.213 46.787-46.787 29.394 29.394c2.928 2.929 6.767 4.393 10.606 4.393 13.244 0 20.082-16.131 10.606-25.607-49.813-49.813 51.102 51.102-175.999-176z"/>
          <path style={{fill: `${enabled?"white":"rgb(148,150,156)"}`}} d="M 222.787 172 L 187.5 207.287 L 155.902 239.124 L 195.008 278.23 C 204.486 287.708 197.644 303.837 184.402 303.837 C 180.563 303.837 176.724 302.373 173.796 299.444 L 134.689 260.337 L 90.607 304.18 C 73.02 321.766 73.018 350.232 90.607 367.819 L 106.787 383.999 L 4.394 486.393 C -1.464 492.251 -1.464 501.748 4.394 507.606 C 10.251 513.463 19.749 513.464 25.607 507.606 L 128 405.213 L 144.18 421.393 C 161.724 438.938 190.274 438.939 207.82 421.393 L 340 289.213 L 222.787 172 Z"/>
        </g>
      </svg>
      <Header disabled={!enabled} as="h4" className="active-step-title noselect center">
        {strings["ABL sensor"]}
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
