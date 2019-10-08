import * as React from "react"
const styles = require("./search.module.scss")

interface resultItem {
  productID: number
  itemUrl: string
  productDescription: string
  itemDescription: string
  itemTitle: string
}
interface SearchResultTopicProps {
  itemData: resultItem
}

const SearchResultItem: React.FunctionComponent<
  SearchResultTopicProps
> = props => {
  const { itemData } = props
  const id = styles["prod" + itemData.productID.toString()]

  const handleClick = e => {
    e.preventDefault()
    var event: IGAEvent = {
      category: "Search service",
      action: "Result click",
      label: itemData.itemUrl,
      value: 1,
    }
    // window.idcAnalytics.pushEvent(event)
  }

  return (
    <div className={styles.searchResult}>
      <a
        className={styles.searchResult__title}
        href={itemData.itemUrl}
        onClick={handleClick}
      >
        {itemData.itemTitle}
      </a>
      <span className={styles.searchResult__product + " " + id}>
        {itemData.productDescription}
      </span>
      <p className={styles.searchResult__description}>
        {" "}
        {itemData.itemDescription}
      </p>
    </div>
  )
}

export default SearchResultItem
