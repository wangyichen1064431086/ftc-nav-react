import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Nav from '../src/js/index.js';
//import Nav from '../build/index.es.js';

import { channelData } from './data.js';

class App extends React.Component {
  render() {
    return (
      <Nav channels={channelData} dynamicnav={false} defaultSelectedTopChannelOrder={1} defaultSelectedSubChannelOrder={1}/>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);