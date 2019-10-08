import * as React from "react"
import { shallow, mount } from "enzyme"
jest.mock("../Utils/buildCells")
import { buildCells } from "../Utils/buildCells"
import EntityTable from "../EntityTable"

const mockBuildCells = buildCells as jest.Mock

const dataProps = {
  footRows: [],
  headRows: [],
  cols: [],
  rows: [],
  crossLink: [],
}

const blankRowData = (params: any = {}) => {
  return {
    cssClass: "",
    formattedData: params["fdata"],
    columnClasses: "",
    hasCrossLinks: false,
    crosslink: "",
  }
}

const blankCell = (params: any = {}) => {
  return {
    className: "",
    crossLink: "",
    index: 1,
    cellDisplayText: "--",
  }
}

const fdata = ["Egyptian", "710", "0.4", "0.3", "578", "0.3", "0.3", "+132"]

describe("Rendering footer row", () => {
  it("renders a footer component for each footer row passed to it", () => {
    const footerRows = [
      {
        cols: [],
        cssClass: "",
        key: "First-Key",
      },
      {
        cols: [],
        cssClass: "",
        key: "Second-Key",
      },
    ]
    let newProps = {
      footRows: footerRows,
    }
    let table: any = shallow(
      <EntityTable
        data={{ ...dataProps, ...newProps }}
        exportInfo={{}}
        name={""}
      />
    )
    expect(table.find("FooterRow").length).toEqual(footerRows.length)
  })
  it("passes the cssClass to each footer row", () => {
    const cssClass = "some-class"
    const footerRows = [
      {
        cols: [],
        cssClass: cssClass,
        key: "First-Key",
      },
    ]
    let newProps = {
      footRows: footerRows,
    }
    const table = shallow(
      <EntityTable data={{ ...dataProps, ...newProps }} name={""} />
    )
    expect(table.find("FooterRow").prop("cssClass")).toEqual(cssClass)
  })
  it("passes the cells to each footer row", () => {
    const cols = [
      {
        colSpan: 1,
        cssClass: "cell-class",
        displayText: "displayText",
        rowSpan: 1,
      },
    ]
    const footerRows = [
      {
        cols: cols,
        cssClass: "",
        key: "First-Key",
      },
    ]
    let newProps = {
      footRows: footerRows,
    }
    const table = shallow(
      <EntityTable data={{ ...dataProps, ...newProps }} name={""} />
    )
    expect(table.find("FooterRow").prop("cols")).toEqual(cols)
  })
})

// describe("rendering table row", () => {
//   it("renders a TableRow for each row data given to it", () => {
//     const tableRowsCount = 2
//     const rows = [...Array(tableRowsCount).keys()].map((row, i) => {
//       return blankRowData()
//     })

//     const rowProps = {
//       rows,
//     }

//     expect(
//       shallow(
//         <EntityTable data={{ ...dataProps, ...rowProps }} name={""} />
//       ).find("TableRow").length
//     ).toEqual(tableRowsCount)
//   })

//   it("generates cells for every row", () => {
//     jest.resetAllMocks()

//     const noOfRows = 5

//     const rows = [...Array(noOfRows).keys()].map((row, i) => {
//       return blankRowData()
//     })
//     const rowProps = {
//       rows,
//     }

//     shallow(<EntityTable data={{ ...dataProps, ...rowProps }} name={""} />)

//     expect(buildCells).toHaveBeenCalledTimes(noOfRows)
//   })

//   it("gives the result of buildCells to the TableRow", () => {
//     const rowProps = {
//       rows: [blankRowData({ fdata })],
//     }

//     const cells = [blankCell(), blankCell()]
//     mockBuildCells.mockReturnValue(cells)

//     const wrapper = shallow(
//       <EntityTable data={{ ...dataProps, ...rowProps }} name={""} />
//     )

//     expect(wrapper.find("TableRow").props()["cells"]).toEqual(cells)
//   })
// })
