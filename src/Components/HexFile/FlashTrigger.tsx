import React from 'react';
import { List, Header, Button, Icon } from 'semantic-ui-react';

const FlashTrigger = () => {

    return (
        <List.Item className="step step4">
            <Icon inverted name="bolt" size="big" className="step-icon" />
            <Header as="h4" className="active-step-title noselect center">
              Flash!
            </Header>
            <Button 
                className="active-btn step-btn icon button flash-firmware-btn center"
                onClick={() => {console.log("Flash fired.")}}
                icon={null}
            >
                Flash!
            </Button> 
        </List.Item>    
    )

}

export default FlashTrigger;