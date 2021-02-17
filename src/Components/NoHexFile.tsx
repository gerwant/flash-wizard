import React, { useState, useEffect } from 'react';
import { Segment, List, Button, Header } from 'semantic-ui-react';
import UserData from '../userData';
import strings from '../localization';
import { Link } from 'react-router-dom';
import logo from '../../assets/czarodziej logo.png';
import electron from 'electron';

import Footer from './Footer';
import Navigator from './Navigator';

const NoHexFile = () => {
  return (
    <div>
      <Navigator />

      <Footer />
    </div>
  );
};

export default NoHexFile;
