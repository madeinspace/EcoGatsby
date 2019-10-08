import * as React from "react"
const styles = require("./search.module.scss")

interface NoSearchResultItemProps {
  clientLongName: string
}

const NoSearchResultItem: React.FunctionComponent<
  NoSearchResultItemProps
> = props => {
  const { clientLongName } = props
  return (
    <div>
      <p>Sorry, there are no results for your search</p>
      <p>You could try: </p>
      <ul>
        <li>Searching for a topic within {clientLongName}</li>
        <li>Searching for another place.</li>
      </ul>
    </div>
  )
}

export default NoSearchResultItem
