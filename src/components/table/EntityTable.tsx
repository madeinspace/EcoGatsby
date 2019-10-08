// #region imports
import * as _ from "lodash"
import * as React from "react"
import { getClassNames } from "../Utils"
import TableRow from "./TableRow"
import { buildCells } from "./Utils/buildCells"
import { FooterRow } from "./FooterRow"
import * as TableSorter from "../Utils"
import SourceAndTopicNotes from "./SourceAndTopicNote"
import $ from "jquery"
import {
  ResetButton,
  Actions,
  EntityContainer,
  ExportDropdown,
} from "../Actions"
//@ts-ignore
import XLSX from "xlsx"
//@ts-ignore
import { saveAs } from "file-saver"
//@ts-ignore
import * as docx from "docx"
//@ts-ignore
import styled from "styled-components"
import PubSub from "pubsub-js"
const styles = require("./EntityTable.module.scss")
// #endregion

const SourceCell = styled.td`
  background-color: white;
  border-right: none;
  // && adds enough specificity to overrule annoying other rules
  && {
    border-right: none;
    background-color: white;
  }
`

const DataRow = ({
  onExpand,
  formattedData,
  crossLink,
  cssClass,
  colClass,
  i,
}) => {
  const cssClassName =
    i % 2 === 0 ? `${styles.odd} ${cssClass}` : `${styles.even} ${cssClass} `
  const hasXLink = crossLink != null || false

  const cellProps: any = {
    cellContent: formattedData,
    columnClasses: colClass,
    hasCrossLinks: hasXLink,
    crosslink: crossLink || "",
  }
  const rowCells = buildCells(cellProps)

  return (
    <TableRow
      {...{ onExpand }}
      key={i}
      cells={rowCells}
      cssClass={cssClassName}
    />
  )
}

const ParentRow = ({ expandable, childRows, i, formattedData, colClass }) => {
  const [expanded, setExpanded] = React.useState(false)
  const clickHandler = () => {
    setExpanded(!expanded)
  }
  const sortEventSubscriber = () => setExpanded(false)
  PubSub.subscribe("table.reset", sortEventSubscriber)

  return (
    <React.Fragment key={i}>
      <DataRow
        formattedData={formattedData}
        crossLink={null}
        cssClass="parent"
        colClass={colClass}
        onExpand={expandable && clickHandler}
        key={i}
        i={i}
      />
      {expanded &&
        childRows &&
        childRows.map((child, j) => {
          return (
            <DataRow
              {...child}
              cssClass="child"
              colClass={colClass}
              key={j}
              i={j}
            />
          )
        })}
    </React.Fragment>
  )
}
class EntityTable extends React.Component<any, any> {
  private initialRows = []
  private colClass = []
  private tableRef = null

  constructor(props) {
    super(props)

    const {
      headRows,
      cols,
      rows,
      footRows,
      noOfRowsOnInit,
      source,
    } = props.data

    this.initialRows = rows
    const renderedHeadRows = headRows.map(this.renderHeaders)
    const renderedColumn = this.renderColumns(cols)
    const renderedRows = rows.map(this.renderRow)
    const renderedFooters = footRows.map(this.renderFooters)
    const initRows = this.getnNumberOfRows(renderedRows, noOfRowsOnInit)
    this.tableRef = React.createRef()

    this.state = {
      showMore: true,
      showMoreButton: noOfRowsOnInit != 0 ? true : false,
      noOfRowsOnInit,
      headRows: renderedHeadRows,
      cols: renderedColumn,
      rows: initRows,
      footRows: renderedFooters,
      source: source,
      sortDir: "",
      resetState: renderedRows,
      sortedColIndex: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { rows, footRows, cols, headRows } = nextProps.data
    const renderedHeadRows = headRows.map(this.renderHeaders)
    const initRows = rows.map(this.renderRow)
    const footerRow = footRows.map(this.renderFooters)
    const renderedColumn = this.renderColumns(cols)
    this.initialRows = rows
    this.setState({
      headRows: renderedHeadRows,
      cols: renderedColumn,
      rows: initRows,
      footRows: footerRow,
      parentRowRefs: [],
    })
  }

  private renderHeaders = (headerRow: IHeaderRow): JSX.Element => {
    const cells: any[] = headerRow.cols.map((cell: ICell, i: number) => {
      const { displayText, cssClass, colSpan } = cell
      const headerCellProps = {
        colSpan,
        className: getClassNames(styles, cssClass),
        key: i,
      }

      return <th {...headerCellProps}>{displayText}</th>
    })

    return (
      <tr className={styles[headerRow.cssClass]} key={headerRow.key}>
        {cells}
      </tr>
    )
  }

  private renderColumns = (cols: IColumn[]): any => {
    const cells: any = cols.map((col: IColumn, i: number) => {
      let label: string = col.displayText
      const columnCellProps = {
        onClick: this.handleSort.bind(this, i),
        className:
          (_.has(col, "sortable") && col.sortable
            ? " " + styles.sortable
            : "") +
          " " +
          getClassNames(styles, col.cssClass) +
          " " +
          getClassNames(styles, col.dataType),
      }

      // keeping the classes for the rows' cells out of the state.
      this.colClass.push(columnCellProps.className)

      return (
        <th {...columnCellProps} key={col.id}>
          {label}
        </th>
      )
    })
    return <tr>{cells}</tr>
  }

  private getnNumberOfRows = (array, n) => {
    return n === 0 ? array : array.slice(0, n)
  }

  private renderRow = (row: IRow, i: number): JSX.Element => {
    const expandable = row.childRows !== undefined && row.childRows.length > 0

    return (
      <ParentRow
        formattedData={row.formattedData}
        childRows={row.childRows}
        expandable={expandable}
        colClass={this.colClass}
        key={row.id}
        i={i}
      />
    )
  }
  private renderFooters(footerRow: any, val: any): any {
    return (
      <FooterRow
        key={val}
        cssClass={footerRow.cssClass}
        cols={footerRow.cols}
      />
    )
  }

  private handleSort = (colIndex: number, e: any): void => {
    // figure out sort direction
    const sortDirection: string =
      this.state.sortDir === "asc" || "" ? "desc" : "asc"
    // sort the rows
    const sortedRows = this.sortRows(colIndex, sortDirection)
    // clear dir class from all sortable the
    $(`.${styles.sortable}`).removeClass(`${styles.asc} ${styles.desc}`)
    // reapply the style to target
    $(e.target).addClass(styles[sortDirection])

    this.setState({
      rows: sortedRows.map(this.renderRow),
      sortDir: sortDirection,
      sortedColIndex: colIndex,
    })
  }

  private sortRows = (colIndex: number, sortDir: string): any[] => {
    const sortedRows: IRow[] = this.initialRows.sort((a: IRow, b: IRow) => {
      let l: any
      let r: any
      if (sortDir === "asc") {
        l = a.data[colIndex] == null ? 0 : a.data[colIndex]
        r = b.data[colIndex] == null ? 0 : b.data[colIndex]
      } else {
        l = b.data[colIndex] == null ? 0 : b.data[colIndex]
        r = a.data[colIndex] == null ? 0 : a.data[colIndex]
      }
      return TableSorter.naturalSort(l, r)
    })
    return sortedRows
  }

  private resetSort = (): void => {
    PubSub.publish("table.reset", {})
    // clear dir class from all sortable th
    $(`.${styles.sortable}`).removeClass(`${styles.asc} ${styles.desc}`)
    // mystery
    this.setState({
      rows: _.sortBy(this.initialRows, "id").map(this.renderRow),
      sortDir: "",
      sortedColIndex: undefined,
    })
  }

  // #region table export
  private export = format => {
    switch (format.id) {
      case 1:
        this.exportToExcel()
        break
      case 2:
        this.exportToWord()
        break
      case 3:
        this.exportToExcel(this.fullExcelWorkbook())
        break
      case 4:
        this.exportToWord(this.fullExcelWorkbook())
        break

      default:
        break
    }
  }

  public attachToWordDocument = (document, excelWorkBook?) => {
    const excelSheet = excelWorkBook
      ? excelWorkBook.Sheets["Sheet1"]
      : XLSX.utils.table_to_sheet(this.tableRef.current)
    const tableRange = excelSheet["!ref"]
    const decodedRange = XLSX.utils.decode_range(tableRange)
    const colCount = decodedRange.e.c + 1
    const rowCount = decodedRange.e.r + 1
    // creates an empty table with rows and cols matching the excel spreadsheet row/col counts
    const table = document.createTable({ rows: rowCount, columns: colCount })

    // looping through the excelSheet rows and colums to get their content
    for (let r = 0; r < rowCount; r++) {
      for (let c = 0; c < colCount; c++) {
        const cellName = XLSX.utils.encode_cell({ r, c })
        const cellData = excelSheet[cellName]
        if (cellData === undefined) {
          continue
        }
        // find the corresponding cell in the table created earlier
        const cell = table.getCell(r, c)
        // and stuff the data exctracted from the excel spreaddheet's cell into the table cell
        cell.addParagraph(new docx.Paragraph(cellData.v))
      }
    }
    // merge the cells that need to be merged
    excelSheet["!merges"].reverse().forEach(cellMerge => {
      const rowNum = cellMerge.s.r
      const row = table.getRow(rowNum)
      row.mergeCells(cellMerge.s.c, cellMerge.e.c)
    })

    return Promise.resolve(document)
  }

  private exportToWord = (excelWorkbook?: any) => {
    const { name } = this.props
    const filename = `${name}.docx`

    // Create document
    const doc = new docx.Document()

    this.attachToWordDocument(doc, excelWorkbook).then(doc => {
      // Used to export the file into a .docx file
      var packer = new docx.Packer()
      packer.toBlob(doc).then(blob => {
        saveAs(blob, filename)
      })
    })
  }

  private exportToExcel = (excelWorkbook?: any) => {
    const { name } = this.props
    const workbook =
      excelWorkbook || XLSX.utils.table_to_book(this.tableRef.current)
    XLSX.writeFile(workbook, `${name}.xlsx`)
  }

  private exportOptions = () => {
    const { rows } = this.props.data
    const isExpandable = _.some(rows, row => row.expandable)
    return isExpandable
      ? {
          formats: [
            { id: 1, displayText: "Excel" },
            { id: 3, displayText: "Excel full" },
            { id: 2, displayText: "Word" },
            { id: 4, displayText: "Word full" },
          ],
        }
      : {
          formats: [
            { id: 1, displayText: "Excel" },
            { id: 2, displayText: "Word" },
          ],
        }
  }

  private fullExcelWorkbook = () => {
    const { headRows, cols, rows, footRows, rawDataSource } = this.props.data
    const headRowsData = headRows.map(row =>
      _.flatMap(row.cols, col => {
        const cols = new Array(col.colSpan)
        cols.fill("")
        cols[0] = col.displayText
        return cols
      })
    )
    const colsData = cols.map(col => {
      return col.displayText
    })

    const footer = footRows.map(row => row.cols.map(col => col.displayText))
    footer.push([rawDataSource])

    const fullData = rows.reduce(
      (acc, current: any) => {
        const parent = current.formattedData
        const children = current.childRows.map(row => row.formattedData)
        return [...acc, parent, ...children, []]
      },
      [...headRowsData, colsData, []]
    )

    fullData.push(...footer)

    const workSheet = XLSX.utils.aoa_to_sheet(fullData)

    workSheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
      { s: { r: 1, c: 1 }, e: { r: 1, c: 3 } },
      { s: { r: 1, c: 4 }, e: { r: 1, c: 6 } },
    ]

    const workBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workBook, workSheet, `Sheet1`)
    return workBook
  }

  // #endregion

  render(): JSX.Element {
    const { headRows, cols, rows, footRows } = this.state
    const { data } = this.props
    const SourceAndTopicNotesProps: ISourceAndTopicNotesProps = {
      source: data.source,
      anchorName: data.anchorName,
      clientAlias: data.clientAlias,
    }
    if (rows) {
      return (
        // <RenderContext.Consumer>
        // {(renderContext)=> (
        //   renderContext === 'word' ?
        //     <React.Fragment/> :
        <EntityContainer>
          <Actions>
            <ResetButton onReset={this.resetSort} />
            <ExportDropdown
              exportOptions={this.exportOptions()}
              handleExport={this.export}
            />
          </Actions>
          <table
            ref={this.tableRef}
            className={styles["entity-table"]}
            id="mytable"
          >
            <thead>
              {headRows}
              {cols}
            </thead>
            <tbody>{rows}</tbody>
            <tfoot>
              {footRows}
              <tr>
                <SourceCell colSpan={data.cols.length}>
                  <SourceAndTopicNotes {...SourceAndTopicNotesProps} />
                </SourceCell>
              </tr>
            </tfoot>
          </table>
        </EntityContainer>
        //   )}
        // </RenderContext.Consumer>
      )
    }
    return <div>Loading...</div>
  }
}

export default EntityTable
