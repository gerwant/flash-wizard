import React, { useState, useEffect } from 'react';
import { Segment, List, Button, Header } from 'semantic-ui-react'
import UserData from "../userData"
import strings from '../localization';
import { Link, Router } from 'react-router-dom';


const StartScreen = () => {
  const [lang, setLang] = useState("en");

  strings.setLanguage(UserData.get("language"));

  function setLanguage(code: string){
    strings.setLanguage(code);
    UserData.set('language', code);
    setLang(code);
    console.log("language: ", code)
  }

  function getFlagStyle(code: string) {
    if(code == lang){
      return({"border": "grey solid thin", "border-radius": "5%"})
    }
    else{
      return({})
    }
  }

  function flag_item(svg_name: string, code: string) {
    return (
          <List.Item as="a" className="item flag-item" onClick={() => setLanguage(code)}>
              <img className={`flag ${code}`}  src={`../assets/flags/${svg_name}.svg`} draggable={false} style={getFlagStyle(code)}/>
          </List.Item>
      )
  }

  return (
    <div className="welcome-body noselect">
      <div className="welcome-wrapper">
          <img className="logo1" draggable={false} src="../assets/czarodziej bez tła blask.png"/>
          <img className="logo2" draggable={false} src="../assets/garage.png"/>
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
                <Header >{strings.mainMenuHeader}</Header>
                <Link to="/hex">
                  <Button className="hex-trigger noselect" >{strings.hexBtn}</Button>
                </Link>
                <br/>
                <Link to="/nohex">
                  <Button className="no-hex-trigger active-btn noselect">{strings.nohexBtn}</Button>
                </Link>
          </Segment>
      </div>
    </div>
  );
};

export default StartScreen;
