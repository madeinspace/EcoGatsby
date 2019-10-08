import { Paragraph as DocxParagraph } from "docx"
import Node from "./node"

export class Paragraph extends Node {
  buildElement(props) {
    if (!!props.className && props.className === "hidden") {
      return
    }
    const paragraph = new DocxParagraph()
    if (!!props.style) { paragraph.style(props.style) }
    return paragraph
  }
}

export default Paragraph