import * as React from 'react';
import { shallow } from 'enzyme';
import { FooterRow } from '../FooterRow';

let rowClassName = 'row-class-name';

const footerProps = {
  cssClass: 'some-class-name',
  cols: []
};

// colSpan = 1,
// cssClass = 'cell-class',
// displayText = 'Cell display text',
// rowSpan = 1

const footerRow = (params = {}): any => {
  return shallow(
    <FooterRow
      {...footerProps}
      cssClass={params['cssClass']}
      cols={params['cols'] || []}
      key="2"
    />
  );
};

const displayTextParam = displayText => {
  return displayText === '' ? '' : displayText || 'Cell display text';
};

const blankCell = (params = {}) => {
  return {
    colSpan: params['colSpan'] || 1,
    cssClass: params['cssClass'] || 'cell-class',
    displayText: displayTextParam(params['displayText']),
    rowSpan: params['rowSpan'] || 1
  };
};

it('returns a table row element', () => {
  expect(footerRow().find('tr').length).toEqual(1);
});

it('has a key prop', () => {
  // expect(
  //   footerRow()
  //     .instance()
  //     .key().length
  // ).toEqual(1);
});

it('sets the css class on the table row from the props', () => {
  expect(
    footerRow({ cssClass: rowClassName })
      .find('tr')
      .hasClass(rowClassName)
  ).toEqual(true);
});

it('returns a table cell element for every cell in the props', () => {
  let cellCount = 3;
  const cells = [...Array(cellCount).keys()].map((cell, i) => {
    return blankCell();
  });

  expect(footerRow({ cols: cells }).find('tr td').length).toEqual(cellCount);
});

//should this be part of testing the cell instead of row?
it('adds the value to each cell when display text is provided', () => {
  // setup
  const cellText = 'text of the cell';
  const cell = blankCell({ displayText: cellText });

  // expectation
  expect(
    footerRow({ cols: [cell] })
      .find('tr td')
      .text()
  ).toEqual(cellText);
});

//should this be part of testing the cell instead of row?
it('adds the value to each cell to -- if no display text provided', () => {
  const cell = blankCell({ displayText: '' });

  expect(
    footerRow({ cols: [cell] })
      .find('tr td')
      .text()
  ).toEqual('--');
});

//should this be part of testing the cell instead of row?
it("sets the cell's class name to each cell from props", () => {
  const cellClassName = 'the name of the class';
  const cell = blankCell({ cssClass: cellClassName });

  expect(
    footerRow({ cols: [cell] })
      .find('tr td')
      .hasClass(cellClassName)
  ).toEqual(true);
});

//should this be part of testing the cell instead of row?
it("sets the cell's key from the index of the cell", () => {
  const cells = [blankCell(), blankCell()];

  expect(
    footerRow({ cols: cells })
      .find('tr td')
      .map((td, i) => td.key())
  ).toEqual(['0', '1']);
});

//should this be part of testing the cell instead of row?
it('sets the cell colspan when it is part of the cell data', () => {
  const colSpan = 2;
  const cell = blankCell({ colSpan: colSpan });

  expect(
    footerRow({ cols: [cell] })
      .find('tr td')
      .props().colSpan
  ).toEqual(colSpan);
});
