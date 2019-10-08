import React from "react"
import * as docx from "docx"
import Reconciler from "react-reconciler"
import { Document as WordDocument } from "./nodes/document"
import { Paragraph as WordParagraph } from "./nodes/paragraph"
import { Text as WordText } from "./nodes/text"
import { Table as WordTable } from "./nodes/table"
import { Image as WordImage } from "./nodes/image"
import { Hyperlink as WordHyperlink } from "./nodes/hyperlink"

export const RenderContext = React.createContext("web")

const DOCUMENT = "DOCUMENT"
const PARAGRAPH = "PARAGRAPH"
const TABLE = "TABLE"
const IMAGE = "IMAGE"

export const Document = props => <DOCUMENT {...props} />
export const Paragraph = props => (
  <RenderContext.Consumer>
    {renderContext =>
      renderContext === "word" ? <PARAGRAPH {...props} /> : <p {...props} />
    }
  </RenderContext.Consumer>
)
// eslint-disable-next-line
export const Heading1 = props => <PARAGRAPH style="Heading1" {...props} />
// eslint-disable-next-line
export const Heading2 = props => <PARAGRAPH style="Heading2" {...props} />
// eslint-disable-next-line
export const Heading3 = props => <PARAGRAPH style="Heading3" {...props} />
// eslint-disable-next-line
export const Heading4 = props => <PARAGRAPH style="Heading4" {...props} />
// eslint-disable-next-line
export const Heading5 = props => <PARAGRAPH style="Heading5" {...props} />
export const Image = props => <IMAGE {...props} />
export const Table = props => <TABLE {...props} />

const HostConfig = {
  supportsMutation: true,

  now() {
    return Date.now()
  },

  getRootHostContext(nextRootInstance) {
    const rootContext = { doc: new docx.Document() }
    return rootContext
  },

  getChildHostContext(parentContext) {
    return parentContext
  },

  getPublicInstance(inst) {
    return inst
  },

  createTextInstance(
    text,
    rootContainerInstance,
    currentHostContext,
    workInProgress
  ) {
    return new WordText({ text }, currentHostContext)
  },

  createInstance(
    type,
    props,
    rootContainerInstance,
    currentHostContext,
    workInProgress
  ) {
    const createComponent = type => {
      switch (type) {
        case "DOCUMENT":
          return new WordDocument(props, currentHostContext)
        case "IMAGE":
          return new WordImage(props, currentHostContext)
        case "TABLE":
          return new WordTable(props, currentHostContext)
        case "a":
          return new WordHyperlink(props, currentHostContext)
        case "PARAGRAPH":
        default:
          return new WordParagraph(props, currentHostContext)
      }
    }
    const Component = createComponent(type)

    return Component
  },

  appendInitialChild(parent, child) {
    parent.addChildElement(child)
  },

  appendChildToContainer(container, rootElement) {
    const packer = new docx.Packer()
    container.docPromise = rootElement.file.then(file => packer.toBlob(file))
  },

  finalizeInitialChildren() {
    return false
  },
  shouldSetTextContent() {
    return false
  },
  removeChildFromContainer() {},
  prepareForCommit() {},
  resetAfterCommit() {},
  commitMount() {},
}

const reconciler = Reconciler(HostConfig)

export const DocxRenderer = {
  render(element) {
    const isAsync = false
    const root = { docPromise: false }
    const container = reconciler.createContainer(root, isAsync)
    const parentComponent = null

    return new Promise(resolve =>
      reconciler.updateContainer(
        <RenderContext.Provider value="word">{element}</RenderContext.Provider>,
        container,
        parentComponent,
        () => resolve(root.docPromise)
      )
    )
  },
}

export default {
  Document,
  Paragraph,
  Image,
  Table,
  DocxRenderer,
}
