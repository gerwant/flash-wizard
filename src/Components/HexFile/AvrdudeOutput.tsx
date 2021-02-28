import React, {useState, useEffect} from 'react';
import { List, Header, Button, Form, TextArea } from 'semantic-ui-react';

import electron from 'electron';
import { avrdude_done, avrdude_response } from '../../constants';

const AvrdudeOutput = ({visible}: {visible: boolean}) => {

    const [output, setOutput] = useState('');

    const addContent = (data: string) => {
        setOutput(output + data );
    }

    useEffect(() => {

      let mounted = true;
      document.getElementsByClassName("avrdude_output")[0].scrollTop = document.getElementsByClassName("avrdude_output")[0].scrollHeight;
      electron.ipcRenderer.on(avrdude_response, (event, data) => {

        if (mounted){
          addContent(data);
        }

      })

      electron.ipcRenderer.on(avrdude_done, (event, data) => {
          if (mounted) {
              //addContent(data+"Flashing finished.");
              addContent(data);
          }
      })

      return ()=>{
        mounted = false;
        console.log("Unmounting", mounted)
        electron.ipcRenderer.removeListener(avrdude_response, () => {})
      }
    }, [addContent])

    return (
        <div className="avrdude_output_wrapper" style={!visible?{display: 'none'}:{}}>
            <Form>
                <TextArea spellCheck="false" value={output} className="avrdude_output noselect" />
            </Form>

        </div>
    )
}

export default AvrdudeOutput;
