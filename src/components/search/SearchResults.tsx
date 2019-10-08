import * as React from "react"
import "whatwg-fetch"
import { KnowledgeBaseCTA } from "./ResultsCTAs/ResultsKnoledgebaseTeaser"
import { SearchResultsFilters } from "./SearchResultsFilters"
import { SearchResultsList } from "./SearchResultsList"
const styles = require("./search.module.scss")
import styled from "styled-components"
import { HeaderRow } from "../grid"

export interface ISearchresultsProps {
  noResults: boolean
  results: any[]
  tabs: any
  currentTab: number
  filter: any
  countTotal: number
  searchOption: string
  hasRegistered: boolean
  client: string
  clientLogo: string
}

export default class Searchresults extends React.PureComponent<
  ISearchresultsProps,
  any
> {
  public render() {
    const {
      noResults,
      results,
      tabs,
      currentTab,
      filter,
      countTotal,
      searchOption,
      hasRegistered,
      client,
      clientLogo,
    } = this.props

    const showOrNot =
      results.length > 0 || noResults ? styles.show : styles.hide

    const SearchResultsContainer = styled.div`
      grid-area: header;
      color: #5f6062;
      font-size: 16px;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      line-height: 1.4;
      font-weight: 300;

      background: #fff;
      margin-top: 30px;
    `

    return (
      <HeaderRow>
        <SearchResultsContainer className={`${showOrNot} row`}>
          {/* // Tabs */}
          <div className={"col-md-4 col-sm-12 col-xs-12"}>
            <SearchResultsFilters
              tabs={tabs}
              handleFilter={filter}
              currentTab={currentTab}
              countTotal={countTotal}
            />
          </div>
          {/* // Resultss */}
          <div className={"col-md-8 col-sm-12 col-xs-12"}>
            {searchOption === "place" && <KnowledgeBaseCTA />}

            <SearchResultsList
              results={results}
              noResults={noResults}
              searchOption={searchOption}
              hasRegistered={hasRegistered}
              clientName={client}
              clientLogo={clientLogo}
            />
          </div>
        </SearchResultsContainer>
      </HeaderRow>
    )
  }
}
