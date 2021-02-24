import React, {useRef} from 'react';
import { List, Header, Icon, Button } from 'semantic-ui-react';

const PortChooser = () => {
  const fileChooser = useRef(null);
  const onButtonClick = () => {
      fileChooser.current.click();
  }
  return (
    <List.Item className="step step3">
      <Icon inverted name="file" size="big" className="step-icon" />
      <Header as="h4" className="active-step-title noselect center">
        Choose file
      </Header>
      <Button
        className="active-btn step-btn icon button center"
        content="File"
        labelPosition="left"
        icon={null}
        onClick={onButtonClick}
      />
      <input 
        ref={fileChooser}
        type="file"
        hidden
        onChange={()=>{console.log("siema.")}}
      />

    </List.Item>
  );
};

export default PortChooser;
