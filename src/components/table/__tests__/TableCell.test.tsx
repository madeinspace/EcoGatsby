import * as React from 'react';
import { shallow } from 'enzyme';
import TableCell from '../TableCell';

const cellProps = (params = {}) => {
  return {
    cellDisplayText: params['cellDisplayText'] || '',
    className: params['className'] || '',
    crossLink: params['crosslink'] || null
  };
};

const crosslink = {
  url: 'http://google.com',
  linkText: 'title',
  cssClass: 'the-crosslink-class'
};

describe('TableCell', () => {
  const shallowWrapper = props => {
    return shallow(<TableCell {...props} />);
  };

  it('sets the cell display text', () => {
    // set up
    const cellDisplayText = 'display text';
    const newProps = cellProps({ cellDisplayText });

    // expectation
    expect(
      shallowWrapper(newProps)
        .find('td')
        .text()
    ).toEqual(cellDisplayText);
  });

  it('sets the css class name', () => {
    const className = 'classname';
    const newProps = cellProps({ className });

    //expectation / action
    expect(
      shallowWrapper(newProps)
        .find('td')
        .hasClass(className)
    ).toBeTruthy();
  });

  describe('There is a crosslink prop passed to the cell', () => {
    it('creates a CellCrossLink and places it inside the TableCell', () => {
      const newProps = cellProps({ crosslink });
      expect(shallowWrapper(newProps).find('CellCrossLink').length).toEqual(1);
    });

    // ask James how to make this fail
    it("passes through the crosslink in the CellCrossLink's props", () => {
      const newProps = cellProps({ crosslink });

      expect(
        shallowWrapper(newProps)
          .find('CellCrossLink')
          .props()['crosslink']
      ).toMatchObject(crosslink);
    });
  });
});
