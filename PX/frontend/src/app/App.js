import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import '../scss/app.scss';

import Router from './Router';
class App extends Component {
  
  render() {
    return (
      <div>
        <div>
          <Router/>
        </div>
      </div>
    )
  }
}

export default App;
