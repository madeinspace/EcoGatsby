import _ from "lodash"
import GatsbyPages from "./GatsbyPages"
import numeral from "numeral"

export const getClassNames = (styles: any, classes: string) => {
  if (_.isEmpty(classes)) {
    return
  }
  const classArr: any = _.split(classes, " ")
  let classNames: string = ""

  _.forEach(classArr, (classN: string) => {
    classNames += _.isUndefined(styles[classN])
      ? " " + classN
      : " " + styles[classN]
  })
  return classNames
}

export const stripEndQuotes = s => {
  let t = s.length
  if (s.charAt(0) == '"') s = s.substring(1, t--)
  if (s.charAt(--t) == '"') s = s.substring(0, t)
  return s
}

export const detectIE = () => {
  const ua: any = window.navigator.userAgent

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  const msie: any = ua.indexOf("MSIE ")
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10)
  }

  const trident: any = ua.indexOf("Trident/")
  if (trident > 0) {
    // IE 11 => return version number
    const rv: any = ua.indexOf("rv:")
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10)
  }

  const edge: any = ua.indexOf("Edge/")
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10)
  }

  // other browser
  return 0
}

export const getHost = () => {
  const domain: any = document.location.hostname.toLowerCase()
  const parts = domain.split(".")
  if (parts[0] === "www") {
    parts.shift()
  }
  parts.shift()
  const result = "." + parts.join(".")
  return result
}

export const getHashParams = () => {
  const hashParams = {}
  let e = undefined
  const a = /\+/g // Regex for replacing addition symbol with a space
  const r = /([^&;=]+)=?([^&;]*)/g
  const d = s => decodeURIComponent(s.replace(a, " "))
  const q = window.location.hash.substring(1)

  while ((e = r.exec(q))) {
    hashParams[d(e[1])] = d(e[2])
  }
  return hashParams
}

export const buildQueryStringWithObjectKeys = (obj: any, jointer: string) =>
  _.map(_.keys(obj), key => key + "=" + obj[key]).join(jointer)

export const getParameterByName = (
  name: string,
  url: string = window.location.href
): string => {
  name = name.replace(/[\[\]]/g, "\\$&")
  const regex: any = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
  const results = regex.exec(url)
  if (!results) {
    return null
  }
  if (!results[2]) {
    return ""
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}

export const insertArrayAt = (array, index, arrayToInsert) => {
  Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert))
  return array
}

export const deserialiseQueryString = (query: string) => {
  return (
    _.chain(query)
      .replace("?", "") // width=727&height=647&layers=1,4&zoom=14&lat=-36.641495731141354&lon=146.76125049591067&mapstyle=road
      .split("&") // ["width=727","height=647", ...]
      // @ts-ignore
      .map(_.partial(_.split, _, "=", 2)) // [["width","727"],["height","647"], ...]
      .fromPairs() // {"width":"727","height":"647", ...}
      .value()
  )
}

export function naturalSort(a, b) {
  const re: any = /(^([+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|^0x[\da-fA-F]+$|\d+)/g
  const sre: any = /^\s+|\s+$/g
  const snre: any = /\s+/g
  const dre: any = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/
  const hre: any = /^0x[0-9a-f]+$/i
  const ore: any = /^0/
  const i: any = s => {
    return (("" + s).toLowerCase() || "" + s).replace(sre, "")
  }
  const x: any = i(a)
  const y: any = i(b)
  const xN: any = x
    .replace(re, "\0$1\0")
    .replace(/\0$/, "")
    .replace(/^\0/, "")
    .split("\0")
  const yN = y
    .replace(re, "\0$1\0")
    .replace(/\0$/, "")
    .replace(/^\0/, "")
    .split("\0")
  const mhre: any = x.match(hre)
  const yhre: any = y.match(hre)
  const xD: any = parseInt(mhre, 16) || (xN.length !== 1 && Date.parse(x))
  const yD: any =
    parseInt(yhre, 16) || (xD && y.match(dre) && Date.parse(y)) || null
  const normChunk: any = (s, l) => {
    return (
      ((!s.match(ore) || l === 1) && parseFloat(s)) ||
      s.replace(snre, " ").replace(sre, "") ||
      0
    )
  }
  let oFxNcL: any
  let oFyNcL: any

  if (yD) {
    if (xD < yD) {
      return -1
    } else if (xD > yD) {
      return 1
    }
  }
  for (
    let cLoc = 0, xNl = xN.length, yNl = yN.length, numS = Math.max(xNl, yNl);
    cLoc < numS;
    cLoc++
  ) {
    oFxNcL = normChunk(xN[cLoc] || "", xNl)
    oFyNcL = normChunk(yN[cLoc] || "", yNl)
    if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
      return isNaN(oFxNcL) ? 1 : -1
    }
    if (/[^\x00-\x80]/.test(oFxNcL + oFyNcL) && oFxNcL.localeCompare) {
      const comp = oFxNcL.localeCompare(oFyNcL)
      return comp / Math.abs(comp)
    }
    if (oFxNcL < oFyNcL) {
      return -1
    } else if (oFxNcL > oFyNcL) {
      return 1
    }
  }
}

export function redirectToAreaByWebID(webID) {
  // redirect to small areas
  var path = window.location.href.split("?")[0]
  var reg = /\/[/home]+$/
  if (reg.test(path)) {
    path = path.substr(0, path.lastIndexOf("/"))
  }
  window.location.href = `${path}about?WebID=${webID}`
}
export const mergeArraysById = (a1, a2, id) =>
  a1.map(itm => ({
    ...a2.find(item => item[id] === itm[id] && item),
    ...itm,
  }))

export function mapByKey(list, keyGetter) {
  const map = new Map()
  list.forEach(item => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })
  var mapAsc = new Map([...map].sort())
  return mapAsc
}

export const pathParts = (path: string) => {
  const REGEX = /^\/?(?<clientAlias>[^\/]+)\/?(?<pageAlias>[^\/]+)?\/?/
  return path.match(REGEX).groups
}

export const IsGatsbyPage = path =>
  GatsbyPages.includes(pathParts(path).pageAlias)

export const formatNumber = number => numeral(number).format("0,0")
export const formatPercent = (number, zero = "0") =>
  number ? numeral(number).format("0,0.0") : zero
export const formatChangeNumber = (number, zero = "0") =>
  number ? numeral(number).format("+0,0") : zero
export const formatChangePercent = (number, zero = "0") =>
  number ? numeral(number).format("+0,0.00") : zero
export const formatShortDecimal = (number, zero = "0") =>
  number ? numeral(number).format("0.0") : zero
