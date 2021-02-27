import React, {useState, useEffect} from 'react';
import { List, Header, Button, Form, TextArea } from 'semantic-ui-react';

import electron from 'electron';
import { avrdude_response } from '../../constants';

const AvrdudeOutput = ({visible}: {visible: boolean}) => {

    const [output, setOutput] = useState('Works');

    const addContent = (data: string) => {

        setOutput(output + data);

    }

    useEffect(() => {

      let mounted = true;

      electron.ipcRenderer.on(avrdude_response, (event, data) => {

        if (mounted){
          addContent(data);
        }  

      })

      return ()=>{
        mounted = false;
        console.log("Unmounting", mounted)
        electron.ipcRenderer.removeListener(avrdude_response, () => {})
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