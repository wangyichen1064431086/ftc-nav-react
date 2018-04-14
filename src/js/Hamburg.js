import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSModules from 'react-css-modules';

import hamburg from '../scss/hamburg.scss';

@CSSModules(hamburg, {allowMultiple: true})
class Hamburg extends React.Component {
  static propTypes = {
    clickHamburg: PropTypes.func
  }
  render() {
    return (
      <div styleName="btn" onClick=        {this.props.clickHamburg}>
      </div>
    )
  }
}

export default Hamburg;