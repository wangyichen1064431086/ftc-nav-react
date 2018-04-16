jest.unmock('../src/js/Nav');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import Nav from '../src/js/Nav.js';
import testData from '../datafortest/testdata.js';

describe('Normal stastic Nav', () => {
  it('render', () => {
    const nav = ReactTestUtils.renderIntoDocument(
      <Nav channels={testData.testData2}/>
    );

    const navNode = ReactDOM.findDOMNode(nav);
    const navEl = navNode.querySelector('nav');
    expect(navNode).toBeInstanceOf(HTMLElement);
    expect(navEl).toBeInstanceOf(HTMLElement);
    expect(navNode.querySelectorAll('nav>ul').length).toBe(2);
    expect(navNode.querySelectorAll('nav>ul')[0].className.includes('list-top')).toBeTruthy;
    expect(navNode.querySelectorAll('nav>ul')[1].className.includes('list-sub')).toBeTruthy;
    expect(navNode.querySelectorAll('nav>ul')[0].querySelector('li ul')).toBeInstanceOf(HTMLElement);
    expect(navNode.querySelectorAll('nav>ul')[0].querySelector('li[order="0"]').className.includes('nav__item-top--selected')).toBeTruthy;
  });
});

describe('Dynamic Nav', () => {
  it('render', () => {
    const nav = ReactTestUtils.renderIntoDocument(
      <Nav channels={testData.testData3} dynamicnav={true}/>
    );

    const navNode = ReactDOM.findDOMNode(nav);
    const navEl = navNode.querySelector('nav');
    expect(navNode).toBeInstanceOf(HTMLElement);
    expect(navEl).toBeInstanceOf(HTMLElement);
    expect(navNode.querySelectorAll('nav>ul').length).toBe(2);
    expect(navNode.querySelectorAll('nav>ul')[0].className.includes('list-top')).toBeTruthy;
    expect(navNode.querySelectorAll('nav>ul')[1].className.includes('list-sub')).toBeTruthy;
    expect(navNode.querySelectorAll('nav>ul')[0].querySelector('li[order="0"]').className.includes('nav__item-top--selected')).toBeTruthy;
    expect(navNode.querySelectorAll('nav>ul')[1].querySelector('li[order="0"]').className.includes('nav__item-sub--selected')).toBeFalsy;

  });

  it('click the top nav item of order1', () => {
    const nav = ReactTestUtils.renderIntoDocument(
      <Nav channels={testData.testData3} dynamicnav={true}/>
    );
    const navNode = ReactDOM.findDOMNode(nav);
    ReactTestUtils.Simulate.click(
      navNode.querySelectorAll('nav>ul')[0].querySelector('li[order="1"]')
    );
    expect(navNode.querySelectorAll('nav>ul')[0].querySelector('li[order="0"]').className.includes('nav__item-top--selected')).toBeFalsy;
    expect(navNode.querySelectorAll('nav>ul')[0].querySelector('li[order="1"]').className.includes('nav__item-top--selected')).toBeTruthy;
  }); 

  it('click the sub nav item of order0', () => {
    const nav = ReactTestUtils.renderIntoDocument(
      <Nav channels={testData.testData3} dynamicnav={true}/>
    );
    const navNode = ReactDOM.findDOMNode(nav);
    ReactTestUtils.Simulate.click(
      navNode.querySelectorAll('nav>ul')[1].querySelector('li[order="0"]')
    );
    expect(navNode.querySelectorAll('nav>ul')[1].querySelector('li[order="0"]').className.includes('nav__item-sub--selected')).toBeTruthy;


  });

  it('click the pushdown nav item of top order1 and sub order1', () => {
    const nav = ReactTestUtils.renderIntoDocument(
      <Nav channels={testData.testData3} dynamicnav={true}/>
    );
    const navNode = ReactDOM.findDOMNode(nav);
    ReactTestUtils.Simulate.click(
      navNode.querySelector('nav>ul:nth-child(1)>li[order="1"]>ul>li[order="1"]')
    );
    expect(navNode.querySelector('nav>ul:nth-child(1)>li[order="1"]').className.includes('nav__item-top--selected')).toBeTruthy;
    expect(navNode.querySelector('nav>ul:nth-child(2)>li[order="1"]').className.includes('nav__item-sub--selected')).toBeTruthy;


  });
});