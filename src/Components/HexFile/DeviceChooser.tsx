import React from 'react';
import { List, Icon, Header, Dropdown } from 'semantic-ui-react';

const DeviceChooser = () => {
  return (
    <List.Item className="step step1">
      <Icon inverted name="microchip" size="big" className="step-icon" />
      <Header as="h4" className="active-step-title noselect center">
        Choose device
      </Header>
      <Dropdown
        text="Devices"
        icon={null}
        className="icon active-btn step-btn button"
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
  );
};

export default DeviceChooser;
