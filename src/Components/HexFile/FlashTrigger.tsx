import React from 'react';
import { List, Header, Button, Icon } from 'semantic-ui-react';

const ipc = require('electron').ipcRenderer;

const FlashTrigger = () => {

    return (
        <List.Item className="step step4">
            <Icon inverted name="bolt" size="big" className="step-icon" />
            <Header as="h4" className="active-step-title noselect center">
              Flash!
            </Header>
            <Button 
                className="active-btn step-btn icon button center"
                onClick={() => {ipc.send('kek')}}
                icon={null}
            >
                Flash!
            </Button> 
        </List.Item>    
    )

}

export default FlashTrigger;