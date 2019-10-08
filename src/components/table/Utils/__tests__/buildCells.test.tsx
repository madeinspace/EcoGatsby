import * as React from 'react';
import * as _ from 'lodash';
import { buildCells } from '../buildCells';

const cellsProps = (params?) => {
  return {
    cellContent: params['cellString'] || ['a', 'b', 'c', 'd'],
    columnClasses: params['columnClasses'] || 'some-class',
    crosslink: params['crosslink'] || null
  };
};

const crosslink = {
  url: 'http://google.com',
  linkText: 'title',
  cssClass: 'the-crosslink-class'
};

describe('buildCells', () => {
  it('returns an array with a cell for every cellData element passed to it', () => {
    const cellCount = 4;
    const cellString = [...Array(cellCount).keys()].map((cell, i) => {
      return `string-${i}`;
    });
    const cellData = cellsProps({ cellString });
    expect(buildCells(cellData).length).toEqual(cellCount);
  });

  it('adds a unique key for each cell', () => {
    const cellCount = 4;
    const cellString = [...Array(cellCount).keys()].map((cell, i) => {
      return `string-${i}`;
    });
    const cellData = cellsProps({ cellString });
    const cells = buildCells(cellData);
    const keys = cells.map((cell: any, i) => {
      return cell.key;
    });
    expect(_.uniq(keys).length).toEqual(cellCount);
  });

  let displayText = 'default display text';

  const cellData = () => cellsProps({ cellString: [displayText] });

  const builtCells = () => buildCells(cellData());

  describe('cell has display text', () => {
    beforeAll(() => {
      displayText = 'display';
    });

    it("passes the display text in the cell's props", () => {
      //TODO: Figure out how to do this without actually rendering TableCell components

      const displayTextProp = builtCells()[0].props['cellDisplayText'];

      expect(displayTextProp).toEqual(displayText);
    });
  });
  describe('cell has no display test', () => {
    beforeAll(() => {
      displayText = null;
    });

    it("passes a double dash as display text in the cell's props", () => {
      const displayTextProp = builtCells()[0].props['cellDisplayText'];

      expect(displayTextProp).toEqual('--');
    });
  });
  it("passes the column's className to the cell's props", () => {
    const className = 'The-Name-of-The-Class';

    const cellData = cellsProps({ columnClasses: [className] });

    const classNameProp = buildCells(cellData)[0].props['className'];

    expect(classNameProp).toEqual(className);
  });

  let cellPosition: any;
  let crossLink: any;
  // EXERCISE modify common buildCells function to use above variables. Call buuildCells inside these tests below. Test for properties of output. Code shouldnt need to change.

  describe('it is the first cell', () => {
    beforeAll(() => {
      cellPosition = 0;
    });
    describe('the crosslink is defined', () => {
      beforeAll(() => {
        crossLink = crosslink;
        cellPosition = 0;
      });
      it("it passes the crosslink in the cell's props", () => {
        const cellData = cellsProps({ crosslink: crossLink });
        const cellsZero = buildCells(cellData)[cellPosition];
        expect(cellsZero.props['crossLink']).toMatchObject(crosslink);
      });
    });
    describe('the crosslink is not defined', () => {
      beforeAll(() => {
        crossLink = null;
        cellPosition = 0;
      });
      it("it passes null as the crosslink in the cell's props", () => {
        const cellData = cellsProps({ crosslink: crossLink });
        const cellsZero = buildCells(cellData)[cellPosition];
        expect(cellsZero.props['crossLink']).toBeNull();
      });
    });
  });

  describe('it is not the first cell', () => {
    beforeAll(() => {
      cellPosition = 1;
    });
    describe('the crosslink is defined', () => {
      beforeAll(() => {
        crossLink = crosslink;
      });
      it("it passes null as the crosslink in the cell's props", () => {
        const cellData = cellsProps({ crosslink: crossLink });
        const cellOne = buildCells(cellData)[cellPosition];
        expect(cellOne.props['crossLink']).toBeNull();
      });
    });
    describe('the crosslink is not defined', () => {
      beforeAll(() => {
        crossLink = null;
      });
      it("it passes null as the crosslink in the cell's props", () => {
        const cellData = cellsProps({ crosslink: crossLink });
        const cellOne = buildCells(cellData)[cellPosition];
        expect(cellOne.props['crossLink']).toBeNull();
      });
    });
  });
});
