import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

import electron from 'electron';
import logo from '../../assets/czarodziej logo.png';

const Navigator = () => {
  return (
    <div>
      <div>
        <Link draggable="false" to="/">
          <Icon
            inverted
            size="big"
            name="arrow circle left"
            className="go-back"
          />
        </Link>
        <Icon
          inverted
          size="big"
          name="help circle"
          className="help-trigger pointer"
        />
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
    </div>
  );
};

export default Navigator;
