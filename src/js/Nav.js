import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSModules from 'react-css-modules';

import Hamburg from './Hamburg.js';
import {getScrollTop, getOffsetTop} from './utils';

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
        callbackFunc: PropTypes.func,//回调函数，需要从父元素传递进来，可有可无，用于向父元素传递选中的topChannelOrder和SubChannelOrder
        sticky: PropTypes.oneOf(['top','sub','all','none'])
    }
    
    static defaultProps = {
        defaultSelectedTopChannelOrder: 0,
        defaultSelectedSubChannelOrder: -1,
        dynamicnav: false,
        sticky: 'none',
        callbackFunc: function() {
            // console.log('Passing:')
            // console.log(Array.from(arguments)[0]);//NOTE:箭头函数中无法使用arguments
        }
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
            isMobile: false,
            stickyTop: false,
            stickySub: false,
            stickyAll: false
        }
        
        this.clickHamburg = this.clickHamburg.bind(this);
        this.initialSelectedChannelInfoByOrder = this.initialSelectedChannelInfoByOrder.bind(this);
        //this.preventGotoHrefWhenMobile = this.preventGotoHrefWhenMobile.bind(this);
        this.callCbFunc = this.callCbFunc.bind(this);
        this.clickTopChannelOnSimpleNav = this.clickTopChannelOnSimpleNav.bind(this);

        this.stickyWhenScroll = this.stickyWhenScroll.bind(this);
    }
    componentWillMount() {
       this.initialSelectedChannelInfoByOrder();
       this.detectIfTheDeviceIsMobile(); //NOTE:从PC切换到Moblie时要再刷新一次，不然不会重新检测设备
    }
    componentDidMount() {
      this.callCbFunc();
      const topNavNode = ReactDOM.findDOMNode(this.refs.topnav);
      const subNavNode = ReactDOM.findDOMNode(this.refs.subnav);
      const allNode = ReactDOM.findDOMNode(this.refs.all);
      this.topNavOffsetTop = getOffsetTop(topNavNode);
      this.subNavOffsetTop = getOffsetTop(subNavNode);
      this.allOffsetTop = getOffsetTop(allNode);

      window.addEventListener('scroll', this.stickyWhenScroll);

    }
    componentDidUpdate() {
      //console.log('exect componentDidUpdate');
      //this.callCbFunc(); //NOTE:这里的话state还是未更新的，
      //待研究：componentDidUpdate不是在render()完成以后执行吗？render()就是基于已经改变的this.state，那么这里的
    }

    detectIfTheDeviceIsMobile() {
        //console.log('exect detectIfTheDeviceIsMobile');
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

    stickyWhenScroll() {
        const scrollTopNow = getScrollTop();
        const {sticky} = this.props;

        if (sticky === 'top') {
            this.setState({
                stickyTop: scrollTopNow > this.topNavOffsetTop
            })
        } else if (sticky === 'sub') {
            this.setState({
                stickySub: scrollTopNow > this.subNavOffsetTop
            })
        } else if (sticky === 'all') {
            this.setState({
                stickyAll: scrollTopNow > this.allOffsetTop
            })
        }
    }
    initialSelectedChannelInfoByOrder() {
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
    clickTopChannelOnTopListWhenDynamic(topOrder,topName, e) { //动态情况下，点击topChannel发生的事情
        this.setState({
            selectedTopChannelOrder:topOrder,
            selectedTopChannelName:topName,
            selectedSubChannelOrder:-1,
            selectedSubChannelName:''
        });
        // console.log('now state:');
        // console.log(this.state);//NOTE:这里的state还是未更新的 —— 已清楚
        this.props.callbackFunc({
            selectedTopChannelOrder: topOrder,
            selectedTopChannelName: topName, 
            selectedSubChannelOrder: -1,
            selectedSubChannelName: ''
        });
    }

    clickSubChannelOnPushdownListWhenDynamic(topOrder, topName, subOrder, subName, e) { //动态情况下，点击下拉菜单的subChannel发生的事情
        e.stopPropagation();//NOTE:重要!如果不阻止冒泡，则还会调用外部topItem上绑定的onClick事件clickTopChannelOnTopListWhenDynamic，则会把selectedSubChannelOrder又置为-1
        this.setState({
            selectedTopChannelOrder: topOrder,
            selectedTopChannelName: topName,
            selectedSubChannelOrder: subOrder,
            selectedSubChannelName: subName
        });
        this.props.callbackFunc({
            selectedTopChannelOrder: topOrder,
            selectedTopChannelName: topName,
            selectedSubChannelOrder: subOrder,
            selectedSubChannelName: subName
        });
    }

    clickSubChannelOnSubListWhenDydnamic(subOrder, subName, topOrder, topName, e) { //动态情况下，点击二级菜单的subChannel发生的事情
        //MARK:也要传递topChannel相关信息，因为这里点击的可能是第一个subChannel，其是频道首页，也就是会改变topChannel相关信息。
        this.setState({
            selectedSubChannelOrder: subOrder,
            selectedSubChannelName: subName,

            selectedTopChannelOrder: topOrder,
            selectedTopChannelName: topName,
        });
        if (this.state.isMobile) {
            this.setState(prevState => ({
                showMobileNav:!prevState.showMobileNav
            }));
        }

        this.props.callbackFunc({
            selectedTopChannelOrder: topOrder,
            selectedTopChannelName: topName,
            selectedSubChannelOrder: subOrder,
            selectedSubChannelName: subName
        });
    }

    clickTopChannelOnTopListWhenStatic(topOrder, e) { //静态情况下点击一级菜单发生的情况：此时点击的是a
        if (this.state.isMobile) {
            e.preventDefault();//如果在mobile的情况下，点击一级目录不可以发生导航
            this.setState({
                selectedTopChannelOrder:topOrder,
                selectedSubChannelOrder:-1,
            });
        }
        this.props.callbackFunc({
            selectedTopChannelOrder: topOrder,
            selectedTopChannelName: topName,
            selectedSubChannelOrder: subOrder,
            selectedSubChannelName: subName
        });
    }

    clickTopChannelOnSimpleNav(topOrder, topName) { //动态情况下，点击simpleNav中一级目录的情况
        this.setState({
            selectedSubChannelOrder: -1,
            selectedSubChannelName: '',
        });//去掉二级目录导航
        this.props.callbackFunc({
            selectedTopChannelOrder: topOrder,
            selectedTopChannelName: topName,
            selectedSubChannelOrder: -1,
            selectedSubChannelName: ''
        });
    }

    renderTopList() {
        const {channels, dynamicnav} = this.props;
        const {selectedTopChannelOrder, selectedSubChannelOrder, stickyTop} = this.state;
        const listStyle = classnames({
            'list': true,
            'list-top':true,
            'sticky': stickyTop
        });
  
        const topChannels = channels;
        const topItems = topChannels.map((topChannel, i) => {
            const topItemStyle = classnames({
                'item': true,
                'item-top': true,
                'item-top--selected': topChannel.order === this.state.selectedTopChannelOrder,
                'item-top--dynamic': dynamicnav
            });
            const topOrder = topChannel.order;
            const topName = topChannel.name;
            const pushdownChannels = topChannel.subs;
            let pushdownItems;
            if (pushdownChannels && pushdownChannels.length > 0) {
                pushdownItems = pushdownChannels.map((pushdownChannel, i) => {
                const pushdownItemStyle = classnames({
                    'pushdown-item': true,
                    'pushdown-item--dynamic': dynamicnav
                });
                const subOrder = pushdownChannel.order;
                const subName = pushdownChannel.name;
                return (
                  <li styleName={pushdownItemStyle} key={subOrder} order={subOrder} onClick={this.clickSubChannelOnPushdownListWhenDynamic.bind(this, topOrder, topName, subOrder, subName)}>
                    {
                        dynamicnav ? 
                        subName :
                        (
                          <a href={pushdownChannel.url}>
                            {subName}
                          </a>
                        )      
                    }
                  </li>
                )});
            }
            return (
                <li styleName={topItemStyle} key={topOrder} order={topOrder} onClick={dynamicnav ? this.clickTopChannelOnTopListWhenDynamic.bind(this, topOrder, topName) : null}>
                    {
                        dynamicnav ? 
                        topName:
                        (
                            <a href={topChannel.url} onClick={this.clickTopChannelOnTopListWhenStatic.bind(this, topOrder)}>
                                {topName}
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
            <ul styleName={listStyle} ref="topnav">
                {topItems}
            </ul>
        )
    }

    renderSubList() { 
        //console.log('exect renderSublist');
        const {channels, dynamicnav} = this.props;
        const {selectedTopChannelOrder, selectedSubChannelOrder, stickySub} = this.state;

        const listStyle = classnames(
            'list', 
            'list-sub',
            {
                'sticky':stickySub
            }
        );
        
        const selectedTopChannel = channels.filter(channel => (
            channel.order === selectedTopChannelOrder
        ))[0];
       
        if (selectedTopChannel) {
            const topOrder = selectedTopChannelOrder;
            const topName = selectedTopChannel.name;
            const topUrl = selectedTopChannel.url;
            
            const subChannels = selectedTopChannel.subs ? JSON.parse(JSON.stringify(selectedTopChannel.subs)) : [];
            //MARK:使用深拷贝
            /* NOTE:数组的深拷贝：
             * 1. arr.slice(0)或arr.concat():伪深拷贝，即到数组只有一维的时候,且每一项不是对象的话这样拷贝看起来和深拷贝效果一样
             * 2. JSON.parse(JSON.stringify(arr)):可以实现真正的深拷贝，
             
            */
            const subChannelHomeName = selectedTopChannelOrder === 0 ? '网站首页': '频道首页';
            if(subChannels.length === 0 ||subChannels[0].order !== 100) {
                subChannels.unshift({
                    name: subChannelHomeName,
                    url:selectedTopChannel.url,
                    order:100
                });
            }
            
            const subItems = subChannels.map(subChannel => {
                const subOrder = subChannel.order;
                const subName = subChannel.name;
                const subUrl = subChannel.url;
                const passSubOrder = subOrder === 100 ? -1 : subOrder;
                const passSubName = subOrder === 100 ? '' : subName;
                const subItemStyle = classnames({
                    item: true,
                    'item-sub':true,
                    'item-sub--selected' : selectedSubChannelOrder === subOrder,
                    'item-sub--dynamic': dynamicnav,
                    'item-first-sub': subOrder === 100
                })
                return (
                    <li styleName={subItemStyle} key={subOrder} order={subOrder} 
                    onClick={dynamicnav ? this.clickSubChannelOnSubListWhenDydnamic.bind(this, passSubOrder, passSubName, topOrder, topName) : null}
                    >
                       {
                            dynamicnav ? 
                            subName:
                            (
                                <a href={subUrl}>
                                {subName}
                                </a>
                            )
                        }
                    </li>
                )
            });
            return (
                <ul styleName={listStyle} ref="subnav">
                    {subItems}
                </ul>
            )
        }
        return null;
       
       
    }

    renderSimpleNav() {
        const { selectedTopChannelOrder, selectedTopChannelName, selectedTopChannelUrl, selectedSubChannelOrder, selectedSubChannelName, selectedSubChannelUrl } = this.state;
        const { dynamicnav } = this.props;
        if (selectedTopChannelOrder === 0 && selectedSubChannelOrder === -1) { //只有在不为首页的情况下再显示
            return null;
        }

        return (
            
            <nav styleName="simple" role="navigation" aria-label="simple-navigation">
                <ul styleName="simple-list">
                    {
                        (selectedTopChannelName && selectedTopChannelOrder !== 0) &&
                        <li styleName="simple-item" onClick={dynamicnav ? this.clickTopChannelOnSimpleNav.bind(this, selectedTopChannelOrder, selectedTopChannelName) : null}>
                            { 
                                dynamicnav ? 
                                selectedTopChannelName :
                                <a href={selectedTopChannelUrl}>
                                    { selectedTopChannelName }
                                </a>
                            }
                        </li>
                    }
                    {
                        selectedSubChannelName && 
                        <li styleName="simple-item">
                            {
                                dynamicnav ?
                                selectedSubChannelName :
                                <a href={selectedSubChannelUrl}>
                                    { selectedSubChannelName }
                                </a>
                            }
                        </li>
                    }
                </ul>
            </nav>
        )
    }

    render() {
        //console.log('Exect render');
        const {showMobileNav, stickyAll} = this.state;
        const allStyle = classnames({
            'sticky': stickyAll

        });
        const navStyle = classnames({
            'nav': true,
            'nav--mobileshow': this.state.showMobileNav,
        });
        return (
          <div ref="all" styleName={allStyle}>
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