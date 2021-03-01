//import 'semantic-ui-css/semantic.min.css'
import React from 'react';
import { render } from 'react-dom';
import { Titlebar, Color } from 'custom-electron-titlebar';
import App from './Components/App';
import '../assets/semantic-ui-css/semantic.min.css'
import './style/App.global.css';
import './style/modals.css';

const titlebar = new Titlebar({
  backgroundColor: Color.fromHex('#272A31'),
});

titlebar.setHorizontalAlignment('left');

render(<App />, document.getElementById('root'));
