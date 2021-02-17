import React, { useState, useEffect } from 'react';
import { Segment, List, Button, Header } from 'semantic-ui-react';
import UserData from '../userData';
import strings from '../localization';
import { Link } from 'react-router-dom';
import logo from '../../assets/czarodziej logo.png';
import electron from 'electron';

import Footer from './Footer';

const NoHexFile = () => {
  return (
    <div>
      <div>
        <Link draggable="false" to="/">
          <i className="pointer go-back big question arrow circle left icon" />
        </Link>
        <i className="pointer help-trigger big question circle icon" />
      </div>
      <div className="logo-wrapper">
        <img
          className="main-website-redir"
          onClick={() =>
            electron.shell.openExternal('https://garage-makezone.eu')
          }
          src={logo}
          width="auto"
          height="150px"
          alt="Main website logo link."
        />
      </div>

      <Footer />
    </div>
  );
};

export default NoHexFile;
