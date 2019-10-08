import * as _ from "lodash"
import * as React from "react"
import CellCrossLink from "./CellCrossLink"

interface ITableCellProps {
  cellDisplayText: string
  className: string
  crossLink: any
}

export default function TableCell(props: ITableCellProps) {
  const { className, crossLink, cellDisplayText } = props

  return (
    <td className={className}>
      {crossLink && <CellCrossLink crosslink={crossLink} />}
      {cellDisplayText}
    </td>
  )
}
