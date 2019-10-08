import wordUtils from "../utils"
import Node from "./node"
import { Image as DocxImage } from "docx"

export class Document extends Node {
  protected buildElement(props) {
    this.extendDocStyles()
    return this.context
  }

  get file() {
    return this.resolveDependencies.then(() => this.context.doc)
  }

  get element() {
    return this._element().then(unwrapped => unwrapped.doc.Document)
  }

  _addChildElement(parent, child) {
    // console.log("parent:", parent, "child:", child)
    if (child instanceof DocxImage) {
      parent.addParagraph(child.Paragraph)
      return
    }
    parent.addParagraph(child)
  }

  extendDocStyles() {
    this.context.doc.Styles.createParagraphStyle("Normal", "Normal")
      .font("Arial")
      .size(wordUtils.pixelsToPointSize(14))
      .color("5f6062")
      .spacing({
        before: wordUtils.pixelsToTWIPS(14),
        after: wordUtils.pixelsToTWIPS(14),
      })
    this.context.doc.Styles.createParagraphStyle("Title", "Title")
      .basedOn("Normal")
      .size(wordUtils.pixelsToPointSize(45))
    this.context.doc.Styles.createParagraphStyle("SubTitle", "SubTitle")
      .basedOn("Normal")
      .size(wordUtils.pixelsToPointSize(23))
    this.context.doc.Styles.createParagraphStyle("Quote", "Quote")
      .basedOn("SubTitle")
      .color("03943f")
      .spacing({
        before: wordUtils.pixelsToTWIPS(23),
        after: wordUtils.pixelsToTWIPS(23),
      })
    this.context.doc.Styles.createParagraphStyle("Hyperlink", "Hyperlink")
      .basedOn("Normal")
      .color("333333")
      .underline("solid", "333333")
    this.context.doc.Styles.createCharacterStyle("Hyperlink", "Hyperlink")
      .basedOn("Normal")
      .color("333333")
      .underline("single", "333333")
  }
}

export default Document
