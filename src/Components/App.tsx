import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import StartScreen from './StartScreen';


export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={StartScreen} />
      </Switch>
    </Router>
  );
}
