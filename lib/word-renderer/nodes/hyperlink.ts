import Node from "./node"

export class Hyperlink extends Node {
  buildElement(props) {
    return this.context.doc.createHyperlink(props.href, "")
  }

  _addChildElement(parent, child) {
    if (typeof child.style === 'function') {
      child.style("Hyperlink")
    }
    parent.addChildElement(child)
  }
}

export default Hyperlink