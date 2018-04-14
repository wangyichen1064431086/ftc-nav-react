import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSModules from 'react-css-modules';

import Hamburg from './Hamburg.js';

import nav from '../scss/nav.scss';


@CSSModules(nav, {allowMultiple: true})
class Nav extends React.Component {
    static propTypes = {
        channels: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                order: PropTypes.number,
                url: PropTypes.string,
                subs: PropTypes.arrayOf(
                    PropTypes.shape({
                        name: PropTypes.string,
                        order: PropTypes.number,
                        url: PropTypes.string
                    })
                )
            })
        ),
        defaultSelectedTopChannelOrder: PropTypes.number,
        defaultSelectedSubChannelOrder: PropTypes.number
    }
    
    static defaultProps = {
        defaultSelectedTopChannelOrder: 0,
        defaultSelectedSubChannelOrder: -1
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedTopChannelOrder: this.props.defaultSelectedTopChannelOrder,
            selectedSubChannelOrder: this.props.defaultSelectedSubChannelOrder,
            showMobileNav: false
        }
        this.clickHamburg = this.clickHamburg.bind(this)
    }
    clickHamburg() {
        this.setState(prevState => ({
            showMobileNav:!prevState.showMobileNav
        }))
    }
    renderHamburg() {
        return (
            <Hamburg clickHamburg={this.clickHamburg} />
        )
    }
    renderTopList() {
        const listStyle = classnames('list','list-top');
        const {channels} = this.props;
        const {selectedTopChannelOrder, selectedSubChannelOrder} = this.state;
        const topChannels = channels;
        const topItems = topChannels.map((topChannel, i) => {
            const topItemStyle = classnames({
                'item': true,
                'item-top': true,
                'item-top--selected': topChannel.order === this.state.selectedTopChannelOrder
            });

            const pushdownChannels = topChannel.subs;
            let pushdownItems;
            if (pushdownChannels && pushdownChannels.length > 0) {
                pushdownItems = pushdownChannels.map((pushdownChannel, i) => (
                  <li styleName='pushdown-item' key={pushdownChannel.order}>
                    <a href={pushdownChannel.url}>
                        {pushdownChannel.name}
                    </a>
                  </li>
                ))
            }

            return (
                <li styleName={topItemStyle} key={topChannel.order}>
                    <a href={topChannel.url}>
                        {topChannel.name}
                    </a>
                    {  (pushdownChannels && pushdownChannels.length > 0) &&
                        <ul styleName="pushdown-list">
                            {pushdownItems}
                        </ul>
                    }

                </li>
            )
        });
        return (
            <ul styleName={listStyle}>
                {topItems}
            </ul>
        )
    }

    renderSubList() {
        const listStyle = classnames('list', 'list-sub');
        const {channels} = this.props;
        const {selectedTopChannelOrder, selectedSubChannelOrder} = this.state;
       
        const subChannels = channels.filter(channel => (
            channel.order === selectedTopChannelOrder
        ))[0].subs;
        const subItems = subChannels.map(subChannel => {
            const subItemStyle = classnames({
                item: true,
                'item-sub':true,
                'item-sub--selected' : selectedSubChannelOrder === subChannel.order
            })
            return (
                <li styleName={subItemStyle} key={subChannel.order}>
                   <a href={subChannel.url}>
                    {subChannel.name}
                    </a>
                </li>
            )
        })
        return (
            <ul styleName={listStyle}>
                {subItems}
            </ul>
        )
    }

    render() {
        return (
          <div>
            <div>
                {this.renderHamburg()}
            </div>
            <nav role="nav" aria-label="main-navigation" styleName="nav">
                {this.renderTopList()}
                {this.renderSubList()}
            </nav>
          </div>
        );
        
    }
}

export default Nav;