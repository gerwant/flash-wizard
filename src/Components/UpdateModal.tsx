import React, {useEffect} from 'react';
const isDev = require('electron-is-dev');
import {Modal, Button, Icon, TransitionablePortal, Accordion, Segment, Dimmer, Loader} from 'semantic-ui-react'
import electron from 'electron';
import strings from '../localization';
const UpdateModal = () => {
  const [open, setOpen] = React.useState(false)
  const [downloading, setDownloading] = React.useState(false)

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
          closeOnDimmerClick={isDev}
          closeOnEscape={isDev}
          >
        <Dimmer active={downloading}>
          <Loader indeterminate style={{display: `${downloading? "": "none"}`}} size='large'>Downloading...</Loader>
        </Dimmer>
            {/* <Icon
              inverted
              size="big"
              name="close"
              className="close-modal pointer"
              style={{color: "white"}}
              onClick={()=>setOpen(false)}
            /> */}
            <h2 className="downloadheader noselect">A new update has just arrived!</h2>
            <div className="ui segment container" >

                <h4 className="content-update noselect">In general, updates are important. It comes with better security, better overall performance and more features! We wouldn't bother you, if it wasn't anything important. You have to have the newest version of Flash Wizard to use it.</h4>

                <div className="footer" style={{marginLeft: "auto !important", marginRight: "auto !important"}}>

                    <div onClick={()=>{electron.ipcRenderer.send("download-update"); setDownloading(true)}} className="ui button active-btn download-update">{strings["Download now"]}</div>

                    {/* <div onClick={()=>setOpen(false)} style={{display: `${isDev?"block": "none"}`}} className="ui button active-btn close-update-win" >Remind me later</div> */}

                </div>
            </div>

        </Modal>
      </TransitionablePortal>
    </div>


)}

export default UpdateModal;
