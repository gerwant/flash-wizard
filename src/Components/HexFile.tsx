import React, { useState, useEffect} from 'react';
import {Segment, List, Button, Header, Icon} from 'semantic-ui-react'
import UserData from "../userData"
import strings from '../localization';
import { Link } from 'react-router-dom';
import logo from "../../assets/czarodziej logo.png"
import electron from 'electron';

const HexFile = () => {
  return(
    <div>
        <div>
          <Link draggable="false" to="/">
            <i className="pointer go-back big question arrow circle left icon"></i>
          </Link>
            <i className="pointer help-trigger big question circle icon"></i>
        </div>
        <div className="logo-wrapper">
            <img className="main-website-redir" onClick={()=>electron.shell.openExternal('https://garage-makezone.eu')} src={logo} width="auto" height="150px"/>
        </div>

        <div className="subtext-wrapper">
            <div className="eras-font main-website-redir" onClick={()=>electron.shell.openExternal('https://garage-makezone.eu')}>BY GMZ</div>
            <div className="eras-font translate shop-website-redir"  onClick={()=>electron.shell.openExternal('https://shop.garage-makezone.eu')} style={{marginLeft: "50px", paddingRight: "5px"}}>VISIT OUR SHOP AT:</div>
            <div className="eras-font shop-website-redir"  onClick={()=>electron.shell.openExternal('https://shop.garage-makezone.eu')} >SHOP.GARAGE-MAKEZONE.EU</div>
        </div>

    </div>
    )
}

export default HexFile;
