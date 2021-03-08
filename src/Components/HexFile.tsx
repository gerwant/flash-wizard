/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { List } from 'semantic-ui-react';

import Footer from './Footer';
import Navigator from './Navigator';
import DeviceChooser from './HexFile/DeviceChooser';
import PortChooser from './HexFile/PortChooser';
import FileChooser from './HexFile/FileChooser';
import FlashTrigger from './HexFile/FlashTrigger';

import AvrdudeOutput from './HexFile/AvrdudeOutput';
import EEPROMModal from './EEPROMModal';

const HexFile = () => {

  const [currentStage, setStage] = useState(1);

  return (
    <div>
      <Navigator />
      <EEPROMModal/>
      <div className="list-wrapper">
        <List horizontal>
          <DeviceChooser enabled={currentStage>=1} hexfile={true} onDone={() => {setStage(2)}} />

          <List.Item className="horizontal-line" />

          <PortChooser enabled={currentStage>=2} onDone={() => {setStage(3)}} />

          <List.Item className="horizontal-line" />

          <FileChooser enabled={currentStage>=3} onDone={() => {setStage(4)}} />

          <List.Item className="horizontal-line" />

          <FlashTrigger enabled={currentStage>=4} onDone={() => {setStage(5)}} />

        </List>
      </div>

      <AvrdudeOutput visible={currentStage>=5}/>

      <Footer />
    </div>
  );
};

export default HexFile;
