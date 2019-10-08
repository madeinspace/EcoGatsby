import * as React from "react"
import styled from "styled-components"
interface ITableRowProps {
  cells: any[]
  cssClass: string
  onExpand: (id: number) => any
}

const Row = styled.tr`
  &.child {
    td {
      background-color: #e6f4ec !important;
    }
    &:hover {
      td {
        background-color: #5f6062 !important;
        color: #fff !important;
      }
    }
  }
`

const TableRow: React.FunctionComponent<ITableRowProps> = props => {
  const { cells, cssClass, onExpand } = props
  return (
    <Row onClick={onExpand || function() {}} className={cssClass}>
      {cells}
    </Row>
  )
}

export default TableRow
