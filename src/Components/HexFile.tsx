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
import electron from 'electron';
import UserData from '../userData';
import strings from '../localization';

import Footer from './Footer';
import Navigator from './Navigator';
import DeviceChooser from './HexFile/DeviceChooser';
import PortChooser from './HexFile/PortChooser';
import FileChooser from './HexFile/FileChooser';

const HexFile = () => {
  return (
    <div>
      <Navigator />

      <div className="list-wrapper">
        <List horizontal>
          <DeviceChooser />

          <List.Item className="horizontal-line" />

          <PortChooser />

          <List.Item className="horizontal-line" />

          <FileChooser />

          <List.Item className="horizontal-line" />
          <List.Item className="step step4">
            <Icon inverted name="bolt" size="big" className="step-icon" />
            <Header as="h4" className="active-step-title noselect center">
              Flash!
            </Header>
            <Button className="active-btn step-btn icon button flash-firmware-btn center">Flash!</Button> 
          </List.Item>
        </List>
      </div>

      <Footer />
    </div>
  );
};

export default HexFile;
