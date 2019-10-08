import * as React from "react"
import { shallow } from "enzyme"
import TableRow from "../TableRow"
import TableCell from "../TableCell"

// const tableRowClassName = 'tableClassName';
// const columnClasses = [
//   'class1 class2 class3',
//   'class1 class2 class3',
//   'class1 class2 class3'
// ];

const tableRow = (params: any = {}) => {
  const { tableRowClassName, cells } = params

  return shallow(
    <TableRow
      onExpand={() => {}}
      cssClass={tableRowClassName || ""}
      cells={cells}
    />
  )
}

// const displayTextParam = displayText => {
//   return displayText === '' ? '' : displayText || 'Cell display text';
// };

const blankCell = (params: any = {}) => {
  const cellDisplayText = params["cellDisplayText"] || ""
  const className = ""
  const crossLink = ""
  const hasCrossLink = true
  return (
    <TableCell
      key={1}
      cellDisplayText={cellDisplayText}
      className={className}
      crossLink={crossLink}
    />
  )
}

const blankCellData = (params: any = {}) => {
  return {
    // key: 1,
    // cell: displayTextParam('') || '--',
    // hasCrossLinks: true,
    // crossLink: null
  }
}

// it("should return a TableRow element", () => {
//   expect(tableRow().find("tr").length).toEqual(1)
// })

// it("sets the table's css class on the table row from the props", () => {
//   const tableRowClassName = "table-row-class-name"

//   expect(
//     tableRow({ tableRowClassName: tableRowClassName })
//       .find("tr")
//       .hasClass(tableRowClassName)
//   ).toEqual(true)
// })

it("renders a table cell element for every cell in the row props", () => {
  let cellCount = 3
  const cells = [...Array(cellCount).keys()].map((cell, i) => {
    return blankCell()
  })

  expect(tableRow({ cells }).find(TableCell).length).toEqual(cellCount)
})
