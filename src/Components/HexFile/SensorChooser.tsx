import React from 'react';
import { List, Header, Dropdown, Icon } from 'semantic-ui-react';

const SensorChooser = () => {

    return (
    <List.Item className="step step2">
      <Icon inverted name="syringe" size="big" className="step-icon syringe-icon" />
      <Header as="h4" className="active-step-title noselect center">
        Choose ABL 
      </Header>
      <Dropdown
        text="ABL"
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

export default SensorChooser;