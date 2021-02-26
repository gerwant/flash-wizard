import React from 'react';
import { List, Header, Dropdown, Icon } from 'semantic-ui-react';

const SensorChooser = ({enabled}: {enabled: boolean}) => {

    return (
    <List.Item className="step step2">
      <Icon disabled={!enabled} inverted name="syringe" size="big" className="step-icon syringe-icon" />
      <Header disabled={!enabled} as="h4" className="active-step-title noselect center">
        Choose ABL 
      </Header>
      <Dropdown
        text="ABL"
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

export default SensorChooser;