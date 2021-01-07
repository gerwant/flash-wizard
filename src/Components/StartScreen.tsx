import React from 'react';
import { Segment, List, Button, Header } from 'semantic-ui-react'

function flag_item(svg_name: string, short: string) {
    return (
        <List.Item as="a" className="item flag-item">
            <img className={`flag ${short}`} src={`../assets/flags/${svg_name}.svg`}/>
        </List.Item>
    )
}

const StartScreen = () => {
  return (
    <div className="welcome-body noselect">
      <div className="welcome-wrapper">
          <img className="logo1" src="../assets/czarodziej bez tła blask.png"/>
          <img className="logo2" src="../assets/garage.png"/>
          <Segment className="flags-container" >
          <List horizontal className="flag-list" style={{marginTop: "10px"}} >
                    
                    {flag_item("united-kingdom", "en")}
                    {flag_item("poland", "pl")}
                    {flag_item("germany", "de")}
                    
          </List>
          <List horizontal className="flag-list" >

                    {flag_item("spain", "es")}
                    {flag_item("france", "fr")}
                    {flag_item("russia", "ru")}
                    
          </List>
          <List horizontal className="flag-list" >

                    {flag_item("italy", "it")}
                    {flag_item("china", "cn")}
                    {flag_item("portugal", "pt")}

          </List>
          </Segment>
          <Segment >
                <Header className="translate">Do you have the .hex file?</Header>
                <Button className="hex-trigger translate" >I have the .hex file</Button>
                <br/>
                <Button className="no-hex-trigger translate active-btn">I don't have the .hex file</Button>
          </Segment>
      </div>
    </div>
  );
};

export default StartScreen;