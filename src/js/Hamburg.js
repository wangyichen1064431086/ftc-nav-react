import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSModules from 'react-css-modules';

import hamburg from '../scss/hamburg.scss';

@CSSModules(hamburg, {allowMultiple: true})
class Hamburg extends React.Component {
  static propTypes = {
    clickHamburg: PropTypes.func,
    type:PropTypes.oneOf(['open','close'])
  }
  static defaultProps = {
    type:'open'
  }
  render() {
    const {type} = this.props;
    const style=classnames({
      'btn':true,
      'btn--open': type === 'open',
      'btn--close': type === 'close'
    })
    return (
      <div styleName={style} onClick= {this.props.clickHamburg}>
      </div>
    )
  }
}

export default Hamburg;