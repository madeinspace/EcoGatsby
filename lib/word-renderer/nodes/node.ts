import isUndefined from "lodash/isUndefined"
const Promise = require("bluebird")

export class Node {
  protected context: any
  protected _element: () => Promise<any>
  protected children: Array<Node>
  protected promiseFuncs: Array<() => Promise<any>>

  constructor(props, context) {
    this.context = context
    const element: any = this.buildElement(props)
    if (element instanceof Promise) {
      this._element = () => element
    } else {
      this._element = () => Promise.resolve(element)
    }
    this.children = []
    this.promiseFuncs = [this._element]
  }

  protected buildElement(props) {
    throw "Not Implemented"
  }

  get element(): Promise<any> {
    return this._element()
  }

  get resolveDependencies(): Promise<any> {
    const childDependencies = () =>
      Promise.mapSeries(this.children, child => child.resolveDependencies)

    /*
     * It is important that promises are resolved _in order_,
     * otherwise elements may appear out of order on the resulting document.
     * As well as Bluebird's `mapSeries` above, we're using `reduce` over an array
     * of functions-returning-Promises to ensure that this happens.
     */
    return [childDependencies, ...this.promiseFuncs].reduce(
      (prev, current) => prev.then(current),
      Promise.resolve()
    )
  }

  _addChildElement(parent, child) {
    parent.addChildElement(child)
  }

  addChildElement(child: Node) {
    this.children.push(child)

    // As mentioned in `resolveDependencies`, we wrap promises in a function to
    // ensure execution order is maintained.
    const promiseFunc = () =>
      Promise.all([this.element, child.element]).then(
        ([parentElement, childElement]) => {
          if (isUndefined(parentElement) || isUndefined(childElement)) {
            return
          }
          this._addChildElement(parentElement, childElement)
        }
      )
    this.promiseFuncs.push(promiseFunc)
  }
}

export default Node
