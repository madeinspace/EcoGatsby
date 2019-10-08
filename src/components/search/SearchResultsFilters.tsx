import * as React from "react"
import ProductTab from "./ProductTab"
const styles = require("./search.module.scss")

interface SearchResultsFiltersProps {
  tabs: any[]
  handleFilter: any
  currentTab: any
  countTotal: number
}

export function SearchResultsFilters(props: SearchResultsFiltersProps) {
  const { tabs, handleFilter, currentTab, countTotal } = props
  const productTabs: any[] = tabs.map((item, i) => {
    return (
      <ProductTab
        key={item.productID}
        productID={item.productID}
        productName={item.productName}
        count={item.count}
        isActive={currentTab === item.productID}
        handleFilter={handleFilter}
      />
    )
  })

  const allSectionTabCLass = `${styles.searchResults__filter} ${
    currentTab == 0 ? styles.searchResults__filter__active : ""
  }`

  return (
    <ul className={styles.searchResults__filters}>
      <li className={allSectionTabCLass} onClick={() => handleFilter(0)}>
        All sections <span className={styles.badge}>{countTotal}</span>
      </li>
      {productTabs}
    </ul>
  )
}
