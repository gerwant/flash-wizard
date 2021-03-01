import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  HashRouter,
  Redirect,
} from 'react-router-dom';
import {Icon} from 'semantic-ui-react'
import StartScreen from './StartScreen';
import HexFile from './HexFile';
import NoHexFile from './NoHexFile';
import UpdateModal from './UpdateModal'
export default function App() {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route exact path="/" component={StartScreen} />
          <Route exact path="/hex" component={HexFile} />
          <Route exact path="/nohex" component={NoHexFile} />
        </Switch>
      </HashRouter>
      <UpdateModal/>
      <div style={{display: "fixed", visibility: "hidden"}}>
        <Icon inverted name="usb"/>
        <Icon inverted name="bolt"/>
        <Icon inverted name="microchip"/>
        <Icon inverted name="syringe"/>
        <Icon inverted name="arrow circle left"/>
        <Icon inverted name="help circle"/>
        <Icon inverted name="setting"/>
        <Icon inverted name="file"/>
      </div>
    </div>
  );
}
