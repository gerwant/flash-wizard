import React from 'react';
import {Modal, Button, Icon, TransitionablePortal,  Grid, Menu, Segment} from 'semantic-ui-react'
import electron from 'electron';
import strings from '../localization'
import {update_faq, faq_content_error, faq_content} from '../constants'
import About from './Settings/About'
import Settings from './Settings/Settings'
const Help = () => {
  const [open, setOpen] = React.useState(false)
  const [activeItem, setActiveItem] = React.useState("Extras")

  const handleClick = (index) => {
    setActiveItem(index)
  }



  return (
    <div>
        <Icon
          inverted
          size="big"
          name="setting"
          onClick={()=>setOpen(true)}
          className="settings-trigger pointer"
        />
      <TransitionablePortal open={open}  transition={{ animation:'scale', duration: 300 }}>
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          style={{background: "#3C404B", height: "85%", marginTop: "5%"}}
          >
            <Icon
              inverted
              size="big"
              name="close"
              className="close-modal pointer"
              style={{color: "white"}}
              onClick={()=>setOpen(false)}
            />
            <Grid verticalAlign='middle' style={{height: "100%", marginTop: "5px"}}>
              <Grid.Column width={1}/>
              <Grid.Column width={3} style={{paddingRight: "0", paddingLeft: "50px !important"}}>
                    <Grid centered>

                    </Grid>
                    <Menu inverted vertical style={{margitLeft: "50px !important"}}>
                      <Menu.Item
                        className="settings-menu-item"
                        name={strings["Extras"]}
                        active={activeItem === 'Extras'}
                        onClick={() => handleClick('Extras')}
                      />
                      <Menu.Item
                        className="settings-menu-item"
                        name={strings["About us"]}
                        active={activeItem === 'About'}
                        onClick={() => handleClick('About')}
                      />
                    </Menu>
              </Grid.Column>

              <Grid.Column stretched width={10} style={{paddingLeft: "0"}}>
                <Segment style={{width: "500px", height: "320px"}}>
                {
                {
                  About: <About/>,
                  Extras: <Settings/>
                }[activeItem]
                }

                </Segment>
              </Grid.Column>
            </Grid>

        </Modal>
      </TransitionablePortal>
    </div>


)}

export default Help;
