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
import FirmwareLanguageModal from './HexFile/FirmwareLanguageModal';

const NoHexFile = () => {

  const [currentStage, setStage] = useState(1);

  return (
    <div>
      <Navigator />

      <div className="list-wrapper">
        <List horizontal>

          <DeviceChooser enabled={currentStage>=1} hexfile={false} onDone={() => {setStage(2)}}/>

          <List.Item className="horizontal-line" />

          <SensorChooser enabled={currentStage>=2} onDone={() => {setStage(3)}}/>
          <FirmwareLanguageModal onDone={()=>{setStage(4)}}/>

          <List.Item className="horizontal-line" />

          <PortChooser enabled={currentStage>=4} onDone={() => {setStage(5)}}/>

          <List.Item className="horizontal-line" />

          <FlashTrigger enabled={currentStage>=5} onDone={() => {setStage(6)}}/>

        </List>
      </div>

      <AvrdudeOutput visible={currentStage>=6} />

      <Footer />
    </div>
  );
};

export default NoHexFile;
