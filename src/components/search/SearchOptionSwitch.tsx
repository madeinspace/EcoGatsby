import * as React from "react"
import SearchOptionItem from "./SearchOptionItem"
const styles = require("./search.module.scss")

interface ISearchOptionSwitchProps {
  activeOption: string
  onSwitch: any
  client: string
}

const SearchOptionSwitch: React.FunctionComponent<
  ISearchOptionSwitchProps
> = props => {
  const { activeOption, onSwitch } = props
  const handleClick = (option: string) => {
    onSwitch(option)
    // window.idcAnalytics.pushEvent({
    //   category: "Search service",
    //   action: "Option click",
    //   label: option,
    //   value: 1,
    // })
  }

  const getCssClass = (option: string) => {
    return `${styles.optionTopic} ${
      activeOption === option ? styles.optionActive : " "
    }`
  }

  return (
    <div className={styles.SearchOptionSwitch + " row"}>
      <div className={"col-md-12"}>
        <SearchOptionItem
          option={"place"}
          handleClick={handleClick}
          cssClass={getCssClass("place")}
        />
        <SearchOptionItem
          option={"topic"}
          handleClick={handleClick}
          cssClass={getCssClass("topic")}
        />
      </div>
    </div>
  )
}

export default SearchOptionSwitch
