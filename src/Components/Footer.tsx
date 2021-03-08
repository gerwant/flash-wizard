import React from 'react';
import electron from 'electron';

const Footer = () => {
  return (
    <div className="subtext-wrapper">
      <div
        className="eras-font main-website-redir noselect"
        onClick={() =>
          electron.shell.openExternal('https://garage-makezone.eu')
        }
        style={{color: '#c8c8c8'}}
      >
        BY GMZ
      </div>
      <div
        className="eras-font translate shop-website-redir noselect"
        onClick={() =>
          electron.shell.openExternal('https://shop.garage-makezone.eu')
        }
        style={{ marginLeft: '50px', paddingRight: '5px', color: '#c8c8c8' }}
      >
        VISIT OUR SHOP AT:
      </div>
      <div
        className="eras-font shop-website-redir noselect"
        onClick={() =>
          electron.shell.openExternal('https://shop.garage-makezone.eu')
        }
        style={{color: '#c8c8c8'}}
      >
        SHOP.GARAGE-MAKEZONE.EU
      </div>
    </div>
  );
};

export default Footer;
