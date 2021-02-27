import React, {useState, useEffect} from 'react';
import { List, Header, Button, Form, TextArea } from 'semantic-ui-react';

import electron from 'electron';

const AvrdudeOutput = ({visible}: {visible: boolean}) => {

    const [output, setOutput] = useState('Works');

    useEffect(() => {

      let mounted = true;

      electron.ipcRenderer.on(dropdown_sensors_content, (event, data) => {

        if (mounted){
          processSensors(data);
        }  

      })

      return ()=>{
        mounted = false;
        console.log("Unmounting", mounted)
        electron.ipcRenderer.removeListener('dropdown-sensors-content', () => {})
      }
    }, [])

    return (
        <div className="avrdude_output_wrapper" style={!visible?{display: 'none'}:{}}>
            <Form>
                <TextArea spellCheck="false" value={output} className="avrdude_output noselect" readOnly={true}></TextArea>
            </Form>
        </div>
    )
}

export default AvrdudeOutput;