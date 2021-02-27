import React, {useState, useEffect} from 'react';
import { List, Header, Button, Icon, Loader } from 'semantic-ui-react';
import strings from '../../localization'
import electron from 'electron';
import { perform_flash, avrdude_done, kill_avrdude } from '../../constants';

const FlashTrigger = ({enabled, onDone}: {enabled: boolean, onDone: () => void}) => {

    const [isFlashing, setFlashing] = useState(false)

    useEffect(() => {

      let mounted = true;

      electron.ipcRenderer.on(avrdude_done, (event, data) => {
          if (mounted) {
              //addContent(data+"Flashing finished.");
              setFlashing(false);
          }
      })

      return ()=>{
        mounted = false;
        console.log("Unmounting", mounted)
        electron.ipcRenderer.removeListener(avrdude_done, () => {})
      }
    }, [])

    const startFlashing = () => {
        electron.ipcRenderer.send(perform_flash);
        setFlashing(true);
        onDone();
    }

    const stopFlashing = () => {
        electron.ipcRenderer.send(kill_avrdude);
        setFlashing(false);
    }

    return (
        <List.Item className="step step4">
            {!isFlashing?
            <Icon disabled={!enabled} inverted name="bolt" size="big" className="step-icon" />
            :
            <Loader active inline inverted size='small' />
            }
            <Header disabled={!enabled} as="h4" className="active-step-title noselect center">
              {strings["Flash!"]}
            </Header>
            {!isFlashing?
            <Button
                className={`${enabled?'':'in'}active-btn step-btn icon button center`}
                disabled={!enabled}
                onClick={() => {startFlashing()}}
                icon={null}
            >
                {strings["Flash!"]}
            </Button>
            :
            <Button
                className={`step-btn icon button center kill-avr-btn`}
                onClick={() => {stopFlashing()}}
                icon={null}
            >
                {strings["Abort"]}
            </Button>
            }
        </List.Item>
    )

}

export default FlashTrigger;
