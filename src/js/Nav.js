import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSModules from 'react-css-modules';

import nav from '../scss/nav.scss';

@CSSModules(nav, {allowMultiple: ture})
class Nav extends React.Component {
    static propTypes = {
        channels: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                order: PropTypes.number,
                subs: PropTypes.arrayOf(
                    PropTypes.shape({
                        name: PropTypes.string,
                        order: PropTypes.number
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
            selectedTopChannelOrder: this.props.defaultSelectedTopChannel,
            selectedSubChannelOrder: this.props.defaultSelectedSubChannel
        }
    }

    renderTopList() {
        const listStyle = classnames('list','list-top');
        const {channels} = this.props.channels;
        const {selectedTopChannelOrder, selectedSubChannelOrder} = this.state;
        const topChannels = channels;
        const topItems = topChannels.map((topChannel, i) => {
            const topItemStyle = classnames({
                'item': true,
                'item-top': true,
                'item-top--selected': topChannel.order === selectedTopChannelOrder
            });

            const pushdownChannels = topChannel.subs;
            let pushdownItems;
            if (pushdownChannels && pushdownChannels.length > 0) {
                pushdownItems = pushdownChannels.map((pushdownChannel, i) => (
                  <li styleName='pushdown-item' key={pushdownChannel.order}>
                    {pushdownChannel.name}
                  </li>
                ))
            }

            return (
                <li styleName={topItemStyle} key={topChannel.order}>
                    {topChannel.name}
                    {  (pushdownChannels && pushdownChannels.length > 0) &&
                        <ul styleName="pushdown-list">
                            {pushdownItems}
                        </ul>
                    }

                </li>
            )
        });
        return (
            <ul styleeName={listStyle}>
                {topItems}
            </ul>
        )
    }

    renderSubList() {
        const listStyle = classnames('list', 'list-sub');
        const {channels} = this.props.channels;
        const {selectedTopChannelOrder, selectedSubChannelOrder} = this.state;
        const subChannels = channels.filter(channel => (
            channel.order === selectedTopChannelOrder
        ))[0].subs;
        const subItems = subChannels.filter(subChannel => {
            const subItemStyle = classnames({
                item: true,
                'item-sub':true,
                'item-sub--selected' : selectedSubChannelOrder
            })
            return (
                <li styleName={subItemStyle} key={subChannel.order}>
                    {subChannel.name}
                </li>
            )
        })
        return (
            <ul styleName={listStyle}>
                {subChannels}
            </ul>
        )
    }

    render() {
        return (
            <nav role="nav" aria-label="main-navigation" styleName="nav">
                {this.renderTopList()}
                {this.renderSubList()}
            </nav>
        );
        
    }
}

export default Nav;