import React from 'react'
import { Button, Modal, TransitionablePortal, Dimmer, Loader } from 'semantic-ui-react'
import electron from 'electron'
import strings from '../localization'

export default function EEPROMModal() {
  const [open, setOpen] = React.useState(false)
  const [loader, setLoader] = React.useState(false)

  React.useEffect(()=>{
    electron.ipcRenderer.on("open-eeprom", () => setOpen(true))
  })

  return (
    <div>

      <TransitionablePortal open={open}  transition={{ animation:'scale', duration: 300 }}>
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          closeOnEscape={!loader}
          style={{background: "#3C404B", width: "80%", marginTop: "5%"}}
          >
        <div style={{fontWeight: 400, fontSize: "20px", color: "white", padding: "50px 50px"}}>
          {strings["EEPROM modal content"]}
        </div>
        <Dimmer active={loader}>
          <Loader indeterminate>Restarting printer...</Loader>
        </Dimmer>
        <Modal.Actions style={{border: "none"}}>
          <Button className="active-btn" onClick={() => setLoader(true)}>OK</Button>
          <Button onClick={() => setOpen(false)}>{strings["Close"]}</Button>
        </Modal.Actions>
        </Modal>
      </TransitionablePortal>
    </div>
)
}
