import { Media } from "docx"
import Node from "./node"

export class Image extends Node {
  fitToPage({ width, height }) {
    const a4pPageWidthInPoints = 595.3
    if (width > a4pPageWidthInPoints) {
      height = height * (a4pPageWidthInPoints / width)
      width = a4pPageWidthInPoints
    }
    return { width, height }
  }

  buildElement(props) {
    const promise =
      props.promise ||
      Promise.resolve({
        imageData: props.src,
        width: props.width || 1,
        height: props.height || 1,
      })

    return promise.then(({ imageData, width, height }) => {
      const { width: adjustedWidth, height: adjustedHeight } = this.fitToPage({
        width,
        height,
      })
      return Media.addImage(
        this.context.doc,
        imageData,
        adjustedWidth,
        adjustedHeight
      )
    })
  }
}

export default Image
