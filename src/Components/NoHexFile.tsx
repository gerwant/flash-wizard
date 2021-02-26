import React, { useState, useEffect } from 'react';
import { Segment, List, Button, Header } from 'semantic-ui-react';
import UserData from '../userData';
import strings from '../localization';
import electron from 'electron';

import Footer from './Footer';
import Navigator from './Navigator';

import DeviceChooser from './HexFile/DeviceChooser';
import PortChooser from './HexFile/PortChooser';
import FlashTrigger from './HexFile/FlashTrigger';
import AvrdudeOutput from './HexFile/AvrdudeOutput';
import SensorChooser from './HexFile/SensorChooser';

const NoHexFile = () => {

  const [currentStage, setStage] = useState(1);

  const nextStep = function(): void {
    if ((currentStage<4)&&(currentStage>=1)) {
      setStage(currentStage+1);
    }
  }

  return (
    <div>
      <Navigator />

      <div className="list-wrapper">
        <List horizontal>

          <DeviceChooser enabled={currentStage>=1} hexfile={false} onDone={nextStep}/>

          <List.Item className="horizontal-line" />

          <SensorChooser enabled={currentStage>=2}/>

          <List.Item className="horizontal-line" />

          <PortChooser enabled={currentStage>=3} onDone={nextStep}/>

          <List.Item className="horizontal-line" />

          <FlashTrigger enabled={currentStage>=4}/>

        </List>
      </div>

      <AvrdudeOutput/>

      <Footer />
    </div>
  );
};

export default NoHexFile;
