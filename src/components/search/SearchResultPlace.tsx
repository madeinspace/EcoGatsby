import * as React from "react"
const styles = require("./search.module.scss")

interface ISearchResultItemProps {
  itemData: resultItem
  inArea?: boolean
  hasRegistered?: boolean
}

interface resultItem {
  areaName: string
  councilName: string
  inArea: true
  itemUrl: string
  nodeName: string
  originCouncilName: string
  productDescription: string
  productDomain: string
  productID: number
}

const SearchResultItem: React.FunctionComponent<
  ISearchResultItemProps
> = props => {
  const { itemData, hasRegistered, inArea } = props
  const id = styles["prod" + itemData.productID.toString()]
  const handleClick = () => {
    // window.idcAnalytics.pushEvent({
    //   category: "Search Service",
    //   action: "Result click",
    //   label: itemData.areaName,
    //   value: 1,
    // })
  }

  return (
    <div className={styles.searchResult}>
      <a
        className={styles.searchResult__title}
        href={hasRegistered || inArea ? itemData.itemUrl : "#"}
        onClick={handleClick}
      >
        {itemData.areaName}
        {itemData.councilName == itemData.areaName
          ? ""
          : "in " + itemData.councilName}
      </a>
      <span className={styles.searchResult__product + " " + id}>
        {itemData.productDescription}
      </span>
    </div>
  )
}

export default SearchResultItem
