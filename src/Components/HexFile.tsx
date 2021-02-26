/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import {
  Segment,
  List,
  Button,
  Header,
  Icon,
  Dropdown,
} from 'semantic-ui-react';
const electron = require('electron');
import UserData from '../userData';
import strings from '../localization';

import Footer from './Footer';
import Navigator from './Navigator';
import DeviceChooser from './HexFile/DeviceChooser';
import PortChooser from './HexFile/PortChooser';
import FileChooser from './HexFile/FileChooser';
import FlashTrigger from './HexFile/FlashTrigger';

import AvrdudeOutput from './HexFile/AvrdudeOutput';

const HexFile = () => {

  const [currentStage, setStage] = useState(1);

  const nextStep = function(): void {
    if ((currentStage<4)&&(currentStage>=1)) {
      setStage(currentStage+1);
    }
  }

  /*useEffect(() => {
    
  }, [])*/

  return (
    <div>
      <Navigator />

      <div className="list-wrapper">
        <List horizontal>
          <DeviceChooser enabled={currentStage>=1} hexfile={true} onDone={nextStep} />

          <List.Item className="horizontal-line" />

          <PortChooser enabled={currentStage>=2} onDone={nextStep} />

          <List.Item className="horizontal-line" />

          <FileChooser enabled={currentStage>=3}/>

          <List.Item className="horizontal-line" />

          <FlashTrigger enabled={currentStage>=4}/>
          
        </List>
      </div>

      <AvrdudeOutput/>

      <Footer />
    </div>
  );
};

export default HexFile;
