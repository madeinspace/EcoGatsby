import * as React from 'react';

export function FooterRow(props: any) {
  const { cssClass, cols } = props;
  const cell = cols.map((col: any, i: number) => {
    return (
      <td colSpan={col.colSpan} key={i} className={col.cssClass}>
        {col.displayText || '--'}
      </td>
    );
  });
  return (
    // TODO: Ask Mr Ambrose why tests fail if we don't test for the cell first
    cell && <tr className={cssClass}>{cell}</tr>
  );
}
