import React from 'react';
import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';

import Nav from './Nav';
import Schedule from './Schedule';
import Students from './Students';
import 'react-big-calendar/lib/css/react-big-calendar.css'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Nav />
        <div>
          <Route path='/schedule'>
            <Schedule />
          </Route>
          <Route path='/students'>
            <Students />
          </Route>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
