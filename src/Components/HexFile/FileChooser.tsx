import React, {useRef} from 'react';
import { List, Header, Icon, Button } from 'semantic-ui-react';

const PortChooser = ({enabled}: {enabled: boolean}) => {
  const fileChooser = useRef(null);

  const onButtonClick = () => {
    if (fileChooser!=null){
      fileChooser.current.click();
    }
  }

  return (
    <List.Item className="step step3">
      <Icon disabled={!enabled} inverted name="file" size="big" className="step-icon" />
      <Header disabled={!enabled} as="h4" className="active-step-title noselect center">
        Choose file
      </Header>
      <Button
        className={`${enabled?'':'in'}active-btn step-btn icon button center`}
        disabled={!enabled}
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
