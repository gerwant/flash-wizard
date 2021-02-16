import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, HashRouter, Redirect } from 'react-router-dom';
import StartScreen from './StartScreen';
import HexFile from './HexFile';
import NoHexFile from './NoHexFile';

export default function App() {
  return (<div>
  <HashRouter>
      <Switch>
        <Route exact path="/" component={StartScreen} />
        <Route exact path="/hex" component={HexFile} />
        <Route exact path="/nohex" component={NoHexFile} />
      </Switch>
    </HashRouter>
  </div>
  );
}
