/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import { Segment, List, Button, Header, Icon } from 'semantic-ui-react';
import electron from 'electron';
import { Link } from 'react-router-dom';
import UserData from '../userData';
import strings from '../localization';
import logo from '../../assets/czarodziej logo.png';

import Footer from './Footer';

const HexFile = () => {
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
          alt="Website link."
        />
      </div>

      <Footer />
    </div>
  );
};

export default HexFile;
