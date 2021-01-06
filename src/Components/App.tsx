import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Segment, List, Button, Header } from 'semantic-ui-react'


const Hello = () => {
  return (
    <div className="welcome-body noselect">
      <div className="welcome-wrapper">
          <img className="logo1" src="../assets/czarodziej bez tła blask.png"/>
          <img className="logo2" src="../assets/garage.png"/>
          <Segment style={{marginBottom : "10px"}}>
          <List horizontal className="flag-list" style={{marginTop: "10px"}} >
                    <List.Item as="a" className="item flag-item">
                        <img className="flag en" src="../assets/flags/united-kingdom.svg"/>
                    </List.Item>
                    <List.Item as="a" className="item flag-item">
                        <img className="flag pl" src="../assets/flags/poland.svg"/>
                    </List.Item>
                    <List.Item as="a" className="item flag-item">
                        <img className="flag de" src="../assets/flags/germany.svg"/>
                    </List.Item>
          </List>

          <List horizontal className="flag-list" >
                    <List.Item as="a" className="item flag-item">
                        <img className="flag en"  src="../assets/flags/spain.svg"/>
                    </List.Item>
                    <List.Item as="a" className="item flag-item">
                        <img className="flag pl" src="../assets/flags/france.svg"/>
                    </List.Item>
                    <List.Item as="a" className="item flag-item">
                        <img className="flag de"  src="../assets/flags/russia.svg"/>
                    </List.Item>
          </List>

          <List horizontal className="flag-list" >
                    <List.Item as="a" className="item flag-item">
                        <img className="flag en"  src="../assets/flags/italy.svg"/>
                    </List.Item>
                    <List.Item as="a" className="item flag-item">
                        <img className="flag pl" src="../assets/flags/china.svg"/>
                    </List.Item>
                    <List.Item as="a" className="item flag-item">
                        <img className="flag de" src="../assets/flags/portugal.svg"/>
                    </List.Item>
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

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
