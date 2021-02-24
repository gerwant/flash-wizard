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
  return (
    <div>
      <Navigator />

      <div className="list-wrapper">
        <List horizontal>

          <DeviceChooser />

          <List.Item className="horizontal-line" />

          <SensorChooser />

          <List.Item className="horizontal-line" />

          <PortChooser />

          <List.Item className="horizontal-line" />

          <FlashTrigger />

        </List>
      </div>

      <AvrdudeOutput/>

      <Footer />
    </div>
  );
};

export default NoHexFile;
