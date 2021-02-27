import React from 'react';
import { List, Header, Button, Icon } from 'semantic-ui-react';

import electron from 'electron';
import { perform_flash } from '../../constants';

const FlashTrigger = ({enabled, onDone}: {enabled: boolean, onDone: () => void}) => {

    return (
        <List.Item className="step step4">
            <Icon disabled={!enabled} inverted name="bolt" size="big" className="step-icon" />
            <Header disabled={!enabled} as="h4" className="active-step-title noselect center">
              Flash!
            </Header>
            <Button 
                className={`${enabled?'':'in'}active-btn step-btn icon button center`}
                disabled={!enabled}
                onClick={() => {electron.ipcRenderer.send(perform_flash); onDone();}}
                icon={null}
            >
                Flash!
            </Button> 
        </List.Item>    
    )

}

export default FlashTrigger;