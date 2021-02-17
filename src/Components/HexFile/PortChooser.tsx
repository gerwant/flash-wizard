import React from 'react';
import { List, Header, Dropdown, Icon } from 'semantic-ui-react';

const PortChooser = () => {
  return (
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
  );
};

export default PortChooser;
