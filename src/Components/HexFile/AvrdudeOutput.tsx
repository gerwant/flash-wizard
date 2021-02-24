import React from 'react';
import { List, Header, Button, Form, TextArea } from 'semantic-ui-react';

const AvrdudeOutput = () => {

    return (
        <div className="avrdude_output_wrapper">
            <Form>
                <TextArea spellCheck="false" className="avrdude_output" readOnly={true}></TextArea>
            </Form>
        </div>
    )
}

export default AvrdudeOutput;