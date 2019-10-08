import { Table as DocxTable } from "docx"
import Node from "./node"

export class Table extends Node {
  buildElement(props) {
    return new DocxTable()
  }
}

export default Table
