import React, {useEffect} from 'react';
import {Modal, Button, Icon, TransitionablePortal, Accordion, Segment} from 'semantic-ui-react'
import electron from 'electron';
import strings from '../localization'
import {update_faq, faq_content_error, faq_content} from '../constants'
const Help = () => {
  const [open, setOpen] = React.useState(false)
  const [faq, setFaq] = React.useState([])
  const [faqUpdated, setFaqUpdate] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)

  const handleClick = (index) => {
    const newIndex = activeIndex === index ? -1 : index

    setActiveIndex(newIndex)
  }

  const updateFaq = (event, data) => {
    setFaq(data.faq);
    setFaqUpdate(true);
  }

  const faqError = (event, data) => {
    setFaq([]);
  }

  const getFaq = () => {
      let faqContent = []

      for(let e = 0; e<faq.length; e++){
        console.log(faq[e])
        faqContent.push(
                <div key={e}>
                  <Accordion.Title
                      active={activeIndex === e}
                      index={e}
                      onClick={()=>handleClick(e)}
                      style={{fontSize: "large", fontWeight: "600"}}
                      >
                    <Icon name='dropdown' />
                      {faq[e].title}
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === e}>
                  <div className="content">
                          <div className="translate transition ">{faq[e].content}</div>
                      </div>
                  </Accordion.Content>
                </div>
        )
      }
      return faqContent
    }


  useEffect(()=>{

    let mounted = true;

    electron.ipcRenderer.on(faq_content, (ev, data) => {
      if (mounted) {
      updateFaq(ev, data);
      }
    })

    electron.ipcRenderer.on(faq_content_error, (ev, data) => {
      if (mounted) {
        faqError(ev, data);
      }
    })

    if(!faqUpdated){
      electron.ipcRenderer.send(update_faq)
    }

    return () => {
      mounted = false;
      electron.ipcRenderer.removeListener(faq_content, () => {});
      electron.ipcRenderer.removeListener(faq_content_error, () => {})
    }
  }, [])

  return (
    <div>
      <Icon
            inverted
            size="big"
            name="help circle"
            className="help-trigger pointer"
            onClick={()=>setOpen(true)}
      />
      <TransitionablePortal open={open}  transition={{ animation:'scale', duration: 300 }}>
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          style={{background: "#3C404B", height: "85%", marginTop: "5%", overflowY: "scroll"}}
          >
            <Icon
              inverted
              size="big"
              name="close"
              className="close-modal pointer"
              style={{color: "white"}}
              onClick={()=>setOpen(false)}
            />
            <h1 className="faqheader noselect">FAQ</h1>

            <Segment className="question-segment" style={{width: "600px",margin: 0, textAlign: "left"}}>
              <Accordion inverted className="faq-section">
                {getFaq()}
              </Accordion>
            </Segment>

        </Modal>
      </TransitionablePortal>
    </div>


)}

export default Help;
