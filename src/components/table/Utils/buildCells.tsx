import * as React from "react"
import * as _ from "lodash"
import TableCell from "../TableCell"

export const buildCells = (props): any[] => {
  const { cellContent, columnClasses, crosslink } = props

  const cells: any[] = cellContent.map((cell: string, i: number) => {
    return (
      <TableCell
        key={i}
        cellDisplayText={cell || "--"}
        className={columnClasses[i]}
        crossLink={i === 0 && !_.isUndefined(crosslink) ? crosslink : null}
      />
    )
  })

  return cells
}
