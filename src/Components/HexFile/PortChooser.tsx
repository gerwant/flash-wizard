import React from 'react';
import { List, Header, Dropdown, Icon } from 'semantic-ui-react';

const PortChooser = ({enabled}: {enabled: boolean}) => {
  return (
    <List.Item className="step step2">
      <Icon disabled={!enabled} inverted name="usb" size="big" className="step-icon" />
      <Header disabled={!enabled} as="h4" className="active-step-title noselect center">
        Choose port
      </Header>
      <Dropdown
        text="Port"
        disabled={!enabled}
        icon={null}
        className={`icon ${enabled?'':'in'}active-btn step-btn button`}
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
