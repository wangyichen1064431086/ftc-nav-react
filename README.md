# ftc-nav-react

[![](https://travis-ci.org/wangyichen1064431086/ftc-nav-react.svg?branch=master)](https://travis-ci.org/wangyichen1064431086/ftc-nav-react)

The nav component being used by FTC. It is the react version.

## Install

```
cd yourProject
npm install "@ftchinese/ftc-nav-react" --save 
```

## Usage

Example:

```
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Nav from '@ftchinese/ftc-nav-react';

const channelData = [
  {
    "name": "首页",
    "order":0,
    "subs":[
      {
        "name":"特别报道",
        "order":0
      },
      {
        "name":"热门文章",
        "order":1
      }
    ]  
  },
  {
    "name": "中国",
    "order":1,
    "subs":[
      {
        "name":"政经",
        "order":0
      },
      {
        "name":"商业",
        "order":1
      }
    ]
  },
  {
    "name": "全球",
    "order":2
  },
  {
    "name": "经济",
    "order":3
  },
  {
    "name": "金融市场",
    "order":4
  },
  {
    "name": "商业",
    "order":5
  },
  {
    "name": "创新经济",
    "order":6
  }
];

class App extends React.Component {
  render() {
    return (
      <Nav channels={channelData} dynamicnav={false} />
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

## Props of Nav

You can know about it by the proptypes:

```
static propTypes = {
    channels: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            order: PropTypes.number.isRequired,
            url: PropTypes.string,
            subs: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    order: PropTypes.number.isRequired,
                    url: PropTypes.string
                })
            )
        })
    ),
    dynamicnav: PropTypes.bool,
    defaultSelectedTopChannelOrder: PropTypes.number,
    defaultSelectedSubChannelOrder: PropTypes.number
}
```

### channels

Type Array.The data provided for nav, which is an array and each item of which is an object with required property <code>name</code> and <code>order</code>, and the optional property <code>url</code> and <code>subs</code>.

You should provide the <code>url</code> for each item when the dynamicnav is false.

And the <code> subs </code> is the data of sub channel of each main channel, which follows the same format of main channel.

### dynamicnav

Type Bool. Default false. The signal deciding which type of Nav component you will use. If it is <code>true</code>, the nav is dynamic and you can get different data when clicking the different channel tabs on one single page. And if it is <code>false</code>, the nav is static and you may navigate to another page which depends on the value of <code>url</code> of one channel item.

### defaultSelectedTopChannelOrder

Type Number. Default 0. The order of the default selected channel. It can be 0, 1, 2...

### defaultSelectedSubChannelOrder

Type Number. Default -1. The order of the default selected sub channel. It can be 0, 1, 2...and can also be -1, which means there is no sub channel selected.