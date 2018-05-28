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
        defaultSelectedSubChannelOrder: PropTypes.number,
        callbackFunc: PropTypes.func//回调函数，需要从父元素传递进来，可有可无，用于向父元素传递选中的topChannelOrder和SubChannelOrder
    }
    
    static defaultProps = {
        defaultSelectedTopChannelOrder: 0,
        defaultSelectedSubChannelOrder: -1,
        dynamicnav: true,
        callbackFunc: () => {}
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedTopChannelOrder: this.props.defaultSelectedTopChannelOrder,
            selectedSubChannelOrder: this.props.defaultSelectedSubChannelOrder,
            selectedTopChannelName: '',
            selectedSubChannelName: '',
            selectedTopChannelUrl: '',
            selectedSubChannelUrl: '',
            showMobileNav: false,
            isMobile: false
        }
        
        this.clickHamburg = this.clickHamburg.bind(this);
        this.setSelectedChannelNameByOrder = this.setSelectedChannelNameByOrder.bind(this);
        //this.preventGotoHrefWhenMobile = this.preventGotoHrefWhenMobile.bind(this);
        this.callCbFunc = this.callCbFunc.bind(this);
    }
    componentWillMount() {
       this.setSelectedChannelNameByOrder();
       this.detectIfTheDeviceIsMobile();
    }
    componentDidMount() {
      this.callCbFunc();
    }

    detectIfTheDeviceIsMobile() {
        const deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (deviceWidth < 980 ) {
            this.setState({
                isMobile: true
            });
        } //oGrid的各宽度分界点没有包括上边距
    }
    // componentDidUpdate() {//其可以有参数prevProps, prevState
    //     this.setSelectedChannelNameByOrder();
    //     this.callCbFunc();
    // } //会造成setState的循环调用，待查清楚原因
    setSelectedChannelNameByOrder() {
        const {channels} = this.props;
        const {selectedTopChannelOrder, selectedSubChannelOrder} = this.state;
       
        const selectedTopChannel = channels.filter(channel => (
            channel.order === selectedTopChannelOrder
        ))[0];

        
        const selectedTopChannelName = selectedTopChannel.name;
        const selectedTopChannelUrl = selectedTopChannel.url;

        const subChannels = selectedTopChannel.subs;

        const selectedSubChannel = subChannels.filter(subChannel => (
            subChannel.order === selectedSubChannelOrder
        ))[0];//不一定存在
        const selectedSubChannelName = selectedSubChannel ? selectedSubChannel.name : '';
        const selectedSubChannelUrl = selectedSubChannel ? selectedSubChannel.url : '';
        this.setState({
            selectedTopChannelName: selectedTopChannelName,
            selectedTopChannelUrl: selectedTopChannelUrl,
            selectedSubChannelName: selectedSubChannelName,
            selectedSubChannelUrl: selectedSubChannelUrl
        });
    }
    callCbFunc() {
        const {selectedTopChannelOrder, selectedSubChannelOrder, selectedTopChannelName, selectedSubChannelName} = this.state;
        this.props.callbackFunc({
            selectedTopChannelOrder,
            selectedSubChannelOrder,
            selectedTopChannelName, 
            selectedSubChannelName
        });
        // console.log({
        //     selectedTopChannelOrder,
        //     selectedSubChannelOrder,
        //     selectedTopChannelName, 
        //     selectedSubChannelName
        // });
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
        if (this.props.dynamicnav) {
            this.setState({
                selectedTopChannelOrder:topOrder,
                selectedSubChannelOrder:-1
            })
        }
    }

    changeSelectedSubChannelOnPushdownList(topOrder,subOrder,e) {
        e.stopPropagation();//NOTE:重要!如果不阻止冒泡，则还会调用外部topItem上绑定的onClick事件changeSelectedTopChannel，则会把selectedSubChannelOrder又置为-1
        if (this.props.dynamicnav) {
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

    // preventGotoHrefWhenMobile(e) {
    //     if (this.state.isMobile) {
    //         e.preventDefault();//如果在mobile的情况下，点击一级目录不可以发生导航
    //     }
    // }
    handleClickTopChannelA(topOrder, e) {
        if (this.state.isMobile) {
            e.preventDefault();//如果在mobile的情况下，点击一级目录不可以发生导航
            this.setState({
                selectedTopChannelOrder:topOrder,
                selectedSubChannelOrder:-1
            })
        }
    }
    renderTopList() {
        const listStyle = classnames('list','list-top');
        const {channels, dynamicnav} = this.props;
        const {selectedTopChannelOrder, selectedSubChannelOrder} = this.state;
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
                            <a href={topChannel.url} onClick={this.handleClickTopChannelA.bind(this, topOrder)}>
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
        const selectedTopChannel = channels.filter(channel => (
            channel.order === selectedTopChannelOrder
        ))[0];
        if (selectedTopChannel) {
            const subChannels = selectedTopChannel.subs ? selectedTopChannel.subs : [];
            if(subChannels.length === 0 ||subChannels[0].order !== 100) {
                subChannels.unshift({
                    name:'频道首页',
                    url:selectedTopChannel.url,
                    order:100
                });
            }
            
            const subItems = subChannels.map(subChannel => {
                const subOrder = subChannel.order;
                const subItemStyle = classnames({
                    item: true,
                    'item-sub':true,
                    'item-sub--selected' : selectedSubChannelOrder === subOrder,
                    'item-sub--dynamic': dynamicnav,
                    'item-first-sub': subOrder === 100
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

    renderSimpleNav() {
        const { selectedTopChannelOrder, selectedTopChannelName, selectedTopChannelUrl, selectedSubChannelName, selectedSubChannelUrl } = this.state;
        if (selectedTopChannelOrder === 0) { //只有在不为首页的情况下再显示
            return null;
        }
        return (
            selectedTopChannelName &&
            <nav styleName="simple" role="navigation" aria-label="simple-navigation">
                <ul styleName="simple-list">
                    <li styleName="simple-item">
                        <a href={selectedTopChannelUrl}>
                            { selectedTopChannelName }
                        </a>
                    </li>
                    {
                        selectedSubChannelName && 
                        <li styleName="simple-item">
                            <a href={selectedSubChannelUrl}>
                                { selectedSubChannelName }
                            </a>
                        </li>
                    }
                </ul>
            </nav>
        )
    }

    render() {
        const navStyle = classnames({
            nav: true,
            'nav--mobileshow': this.state.showMobileNav
        })
        return (
          <div>
            {this.renderHamburg()}
            <nav role="navigation" aria-label="main-navigation" styleName={navStyle}>
                {this.renderTopList()}
                {this.renderSubList()}
            </nav>
            {this.renderSimpleNav()} 

          </div>
        );
        
    }
}

export default Nav;