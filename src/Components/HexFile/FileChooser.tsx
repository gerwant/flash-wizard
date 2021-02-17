import React from 'react';
import { List, Header, Icon } from 'semantic-ui-react';

const PortChooser = () => {
  return (
    <List.Item className="step step3">
      <Icon inverted name="file" size="big" className="step-icon" />
      <Header as="h4" className="active-step-title noselect center">
        Choose file
      </Header>
    </List.Item>
  );
};

export default PortChooser;
