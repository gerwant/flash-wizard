//import 'semantic-ui-css/semantic.min.css'
import React from 'react';
import { render } from 'react-dom';
import { Titlebar, Color } from 'custom-electron-titlebar';
import App from './Components/App';
import '../assets/semantic-ui-css/semantic.min.css'
import './style/App.global.css';
import './style/modals.css';
import {version} from './package.json'

const titlebar = new Titlebar({
  backgroundColor: Color.fromHex('#272A31'),
});
titlebar.setHorizontalAlignment('left');
titlebar.updateTitle(`Flash Wizard ${version} ${process.env.NODE_ENV=='development' ? 'DEVELOPMENT' : ''}`);

render(<App />, document.getElementById('root'));
