import React, {useRef, useState} from 'react';
import { List, Header, Icon, Button } from 'semantic-ui-react';
import strings from '../../localization';

import electron from 'electron';

const FileChooser = ({enabled, onDone}: {enabled: boolean, onDone: () => void}) => {

  const [ddLabel, setddLabel] = useState('File');

  const fileChooser = useRef(null);

  const shorten = (string: string) => {
    return (string.length>=13) ? string.substr(0,10) + '...' : string
  }

  const onButtonClick = () => {
    if (fileChooser!=null){
      fileChooser.current.click();
    }
  }

  const handleFileChange = (e) => {
    if(e.target.files.length>0){
      console.log(e.target.files[0]);
      electron.ipcRenderer.send('update-filepath', e.target.files[0].path);
      setddLabel(shorten(e.target.files[0].name))
      onDone();
    }
  }

  return (
    <List.Item className="step step3">
      <Icon disabled={!enabled} inverted name="file" size="big" className="step-icon" />
      <Header disabled={!enabled} as="h4" className="active-step-title noselect center">
        {strings["Choose file"]}
      </Header>
      <Button
        className={`${enabled?'':'in'}active-btn step-btn icon button center`}
        disabled={!enabled}
        content={ddLabel}
        labelPosition="left"
        icon={null}
        onClick={onButtonClick}
      />
      <input
        ref={fileChooser}
        type="file"
        hidden
        accept='.hex, .bin'
        onChange={handleFileChange}
      />

    </List.Item>
  );
};

export default FileChooser;
