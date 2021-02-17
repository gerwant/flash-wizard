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
import { Link } from 'react-router-dom';
import UserData from '../userData';
import strings from '../localization';

import Footer from './Footer';
import Navigator from './Navigator';

const HexFile = () => {
  return (
    <div>
      <Navigator />

      <div className="list-wrapper">
        <List horizontal>
          <List.Item className="step step1">
            <Icon inverted name="microchip" size="big" className="step-icon" />
            <Header as="h4" className="active-step-title noselect center">
              Choose device
            </Header>
            <Dropdown
              text="Devices"
              icon={null}
              className="icon active-btn step-btn processor-dropdown button"
              floating
              scrolling
            >
              <Dropdown.Menu>
                <Dropdown.Item text="Test" />
                <Dropdown.Item text="Test" />
                <Dropdown.Item text="Test" />
              </Dropdown.Menu>
            </Dropdown>
          </List.Item>
          <List.Item className="horizontal-line" />
          <List.Item className="step step2">
            <Icon inverted name="usb" size="big" className="step-icon" />
            <Header as="h4" className="active-step-title noselect center">
              Choose port
            </Header>
            <Dropdown
              text="Port"
              icon={null}
              className="icon active-btn step-btn processor-dropdown button"
              floating
              scrolling
            >
              <Dropdown.Menu>
                <Dropdown.Item text="Test" />
                <Dropdown.Item text="Test" />
                <Dropdown.Item text="Test" />
              </Dropdown.Menu>
            </Dropdown>
          </List.Item>
          <List.Item className="horizontal-line" />
          <List.Item className="step step3">
            <Icon inverted name="file" size="big" className="step-icon" />
            <Header as="h4" className="active-step-title noselect center">
              Choose file
            </Header>
            <Dropdown
              text="File"
              icon={null}
              className="icon active-btn step-btn processor-dropdown button"
              floating
              scrolling
            >
              <Dropdown.Menu>
                <Dropdown.Item text="Test" />
                <Dropdown.Item text="Test" />
                <Dropdown.Item text="Test" />
              </Dropdown.Menu>
            </Dropdown>
          </List.Item>
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
