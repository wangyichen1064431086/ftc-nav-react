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
    
    static defaultProps = {
        defaultSelectedTopChannelOrder: 0,
        defaultSelectedSubChannelOrder: -1,
        dynamicnav: false
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
        const type = this.state.showMobileNav ? 'close' : 'open';
        return (
            <Hamburg clickHamburg={this.clickHamburg} type = {type}/>
        )
    }
    changeSelectedTopChannel(topOrder,e) {
        console.log('changeSelectedTopChannel');
        if (this.props.dynamicnav) {
            this.setState({
                selectedTopChannelOrder:topOrder,
                selectedSubChannelOrder:-1
            })
        }
    }

    changeSelectedSubChannelOnPushdownList(topOrder,subOrder,e) {
        console.log('changeSelectedSubChannelOnPushdownList');
        if (this.props.dynamicnav) {
            console.log('topOrder:', topOrder);
            console.log('subOrder:', subOrder);
            this.setState({
                selectedTopChannelOrder: topOrder,
                selectedSubChannelOrder: subOrder
            });
        }
    }

    changeSelectedSubChannelOnSubList(subOrder,e) {
        if (this.props.dynamicnav) {
            this.setState({
                selectedSubChannelOrder: subOrder
            })
        }
    }
    renderTopList() {
        const listStyle = classnames('list','list-top');
        const {channels, dynamicnav} = this.props;
        const {selectedTopChannelOrder, selectedSubChannelOrder} = this.state;
        console.log('selectedTopChannelOrder:', selectedTopChannelOrder);
        console.log('selectedSubChannelOrder:',selectedSubChannelOrder);
        const topChannels = channels;
        const topItems = topChannels.map((topChannel, i) => {
            const topItemStyle = classnames({
                'item': true,
                'item-top': true,
                'item-top--selected': topChannel.order === this.state.selectedTopChannelOrder,
                'item-top--dynamic': dynamicnav
            });
            const topOrder = topChannel.order;

            const pushdownChannels = topChannel.subs;
            let pushdownItems;
            if (pushdownChannels && pushdownChannels.length > 0) {
                pushdownItems = pushdownChannels.map((pushdownChannel, i) => {
                const pushdownItemStyle = classnames({
                    'pushdown-item': true,
                    'pushdown-item--dynamic': dynamicnav
                });
                const subOrder = pushdownChannel.order;
                return (
                  <li styleName={pushdownItemStyle} key={subOrder} order={subOrder} onClick={this.changeSelectedSubChannelOnPushdownList.bind(this, topOrder,subOrder)}>
                    {
                        dynamicnav ? 
                        pushdownChannel.name :
                        (
                          <a href={pushdownChannel.url}>
                            {pushdownChannel.name}
                          </a>
                        )
                        
                    }
                  </li>
                )})
            }

            return (
                <li styleName={topItemStyle} key={topOrder} order={topOrder} onClick={this.changeSelectedTopChannel.bind(this, topOrder)}>
                    {
                        dynamicnav ? 
                        topChannel.name :
                        (
                            <a href={topChannel.url}>
                                {topChannel.name}
                            </a>
                        )
                    }
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
        const {channels, dynamicnav} = this.props;
        const {selectedTopChannelOrder, selectedSubChannelOrder} = this.state;
        //console.log('selectedSubChannelOrder:', selectedSubChannelOrder);
        const selectedTopChannel = channels.filter(channel => (
            channel.order === selectedTopChannelOrder
        ))[0];
        if (selectedTopChannel && selectedTopChannel.subs) {
            const subChannels = channels.filter(channel => (
                channel.order === selectedTopChannelOrder
            ))[0].subs;
            
            const subItems = subChannels.map(subChannel => {
                const subOrder = subChannel.order;
                const subItemStyle = classnames({
                    item: true,
                    'item-sub':true,
                    'item-sub--selected' : selectedSubChannelOrder === subOrder,
                    'item-sub--dynamic': dynamicnav
                })
                return (
                    <li styleName={subItemStyle} key={subOrder} order={subOrder} 
                    onClick={this.changeSelectedSubChannelOnSubList.bind(this, subOrder)}
                    >
                       {
                            dynamicnav ? 
                            subChannel.name :
                            (
                                <a href={subChannel.url}>
                                {subChannel.name}
                                </a>
                            )
                        }
                    </li>
                )
            });
            return (
                <ul styleName={listStyle}>
                    {subItems}
                </ul>
            )
        }
        return null;
       
       
    }

    render() {
        const navStyle = classnames({
            nav: true,
            'nav--mobileshow': this.state.showMobileNav
        })
        return (
          <div>
            {this.renderHamburg()}
            <nav role="nav" aria-label="main-navigation" styleName={navStyle}>
                {this.renderTopList()}
                {this.renderSubList()}
            </nav>
          </div>
        );
        
    }
}

export default Nav;