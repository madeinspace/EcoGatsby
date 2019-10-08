import { TextRun as DocxTextRun } from "docx"
import Node from "./node"

export class Text extends Node {
  buildElement(props) {
    return new DocxTextRun(props.text)
  }
}

export default Text