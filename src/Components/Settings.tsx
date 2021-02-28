import React from 'react';
import {Modal, Button, Icon, TransitionablePortal,  Grid, Menu, Segment} from 'semantic-ui-react'
import electron from 'electron';
import strings from '../localization'

import {update_faq, faq_content_error, faq_content} from '../constants'
const Help = () => {
  const [open, setOpen] = React.useState(false)
  const [activeItem, setActiveItem] = React.useState("Settings")

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
            <h1 className="faqheader noselect">{activeItem}</h1>
            <Grid>
              <Grid.Column width={4}>
                <Menu inverted fluid vertical tabular>
                  <Menu.Item
                    name='Settings'
                    active={activeItem === 'Settings'}
                    onClick={() => handleClick('Settings')}
                  />
                  <Menu.Item
                    name='About'
                    active={activeItem === 'About'}
                    onClick={() => handleClick('About')}
                  />
                </Menu>
              </Grid.Column>

              <Grid.Column stretched width={12}>
                <Segment>
                  This is an stretched grid column. This segment will always match the
                  tab height
                </Segment>
              </Grid.Column>
            </Grid>

        </Modal>
      </TransitionablePortal>
    </div>


)}

export default Help;
