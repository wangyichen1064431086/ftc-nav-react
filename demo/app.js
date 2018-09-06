import React from 'react';
import ReactDOM from 'react-dom';

import Nav from '../src/js/Nav.js';
//import Nav from '../build/index.es.js';

import { channelData } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Nav channels={channelData} dynamicnav={true} defaultSelectedTopChannelOrder={1} defaultSelectedSubChannelOrder={1}
      sticky={'top'}
      />
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);