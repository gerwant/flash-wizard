import React, {useEffect} from 'react';
import {Modal, Button, Icon, TransitionablePortal, Accordion, Segment} from 'semantic-ui-react'
import electron from 'electron';
const UpdateModal = () => {
  const [open, setOpen] = React.useState(false)

  useEffect(()=>{

    let mounted = true;

    electron.ipcRenderer.on('new-update', () => setOpen(true))

    return () => {
      mounted = false;
      electron.ipcRenderer.removeListener("new-update", () => {});

    }
  }, [])

  return (
    <div>
      <TransitionablePortal open={open}  transition={{ animation:'scale', duration: 300 }}>
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          style={{background: "#3C404B", height: "70%", width: "70%", marginTop: "5%"}}
          >
            <Icon
              inverted
              size="big"
              name="close"
              className="close-modal pointer"
              style={{color: "white"}}
              onClick={()=>setOpen(false)}
            />
            <h2 className="downloadheader noselect">Do you want to download and install an update?</h2>
            <div className="ui segment container" >

                <h4 className="content-update noselect">In general, updates are important. It comes with better security, better overall performance and more features! We wouldn't bother you, if it wasn't anything important.</h4>

                <div className="footer" style={{marginLeft: "auto !important", marginRight: "auto !important"}}>

                    <div onClick={()=>electron.ipcRenderer.send("download-update")} className="ui button active-btn download-update">Download now</div>

                    <div onClick={()=>setOpen(false)} className="ui button active-btn close-update-win" >Remind me later</div>

                </div>
            </div>

        </Modal>
      </TransitionablePortal>
    </div>


)}

export default UpdateModal;
