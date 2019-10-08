import * as React from "react"
const styles = require("./search.module.scss")

interface ProductTabProps {
  handleFilter: (productID: string) => any
  productName: string
  productID: string
  count: number
  isActive: boolean
}
const ProductTab: React.FunctionComponent<ProductTabProps> = props => {
  const { handleFilter, productName, productID, count, isActive } = props
  const tabClass = `${styles.searchResults__filter} ${
    styles["prod" + productID.toString()]
  } ${isActive ? styles.searchResults__filter__active : ""}`

  return (
    <li
      className={tabClass}
      onClick={() => {
        handleFilter(productID)
      }}
    >
      {productName} <span className={styles.badge}>{count}</span>
    </li>
  )
}

export default ProductTab
