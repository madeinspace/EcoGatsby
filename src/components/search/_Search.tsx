import * as React from "react"
import * as _ from "lodash"
import SearchInput from "./SearchInput"
import SearchResults from "./SearchResults"
import OptionSwitch from "./SearchOptionSwitch"
import { CloseButton } from "./CloseButton"
import { withCookies, Cookies } from "react-cookie"
import { getHashParams } from "../Utils"
import PropTypes from "prop-types"
import styled from "styled-components"
const styles = require("./search.module.scss")
import { HeaderRow } from "../grid"

interface ISearchConfig {
  getAPiUrl: string
  getClientAlias: string
  getClientLogoUrl: string
  getClientLongName: string
  getHubspotAPiUrl: string
  getTrackingID: string
  getWebId: string
}

interface ISearchAppProps {
  searchConfig: ISearchConfig
  alias: string
  clientImage: any
}

interface ISearchState {
  results: any[]
  currentTab: number
  searchTerms: string
  searchOption: string
  currentResultTerm: string
  inProgress: boolean
  noResults: boolean
  showSearch: boolean
  tabs: any[]
  hasRegistered: boolean
  placeholder: string
}

const HeaderID = styled(HeaderRow)`
  background-color: #f2f2f2;
  height: 50px;
  position: relative;
  z-index: 2000;
`

const IDentity = styled.a`
  display: inline-block;
  position: relative;
  width: 300px;
  height: 50px;
`

const SearchInputFaux = styled.div`
  position: absolute;
  top: 7px;
  right: 15px;
  height: 34px;
  padding-left: 30px;
  /* &:after {
    font-family: "id-icons";
    content: "\\e62b";
  } */
`

const SearchInit = styled.input`
  height: 35px;
  line-height: 35px;
  padding: 0 10px 0 35px;
  border: none;
  font-size: 13px;
`

const FauxWrapper = styled.div`
  width: 100%;
  grid-area: header;
  position: relative;
`

const ResultScroller = styled.div`
  grid-area: header;
  margin: 0 auto;
`

const ResultsContainer = styled.div`
  box-shadow: 0 15px 33px -28px grey;
`
const MainSearchWrapper = styled.div`
  height: 155px;
  background-color: #f2f2f2;
`

const SearchTermInputContainer = styled.div`
  grid-area: header;
  background-color: #f2f2f2;
`
const SearchTermInput = styled.div`
  background-color: #f2f2f2;
  position: relative;
  padding-bottom: 20px;
  margin: 0 auto;
`
const SearchInputWrapper = styled(HeaderRow)`
  background-color: #f2f2f2;
`

class SearchApp extends React.Component<ISearchAppProps, ISearchState> {
  private initialSearchResults: any[] = []
  private hsCookie = "id001-hubspot-form-submitted"
  private searchOptionPlaceholders: any = {
    place: "e.g Adelaide",
    topic: "e.g Jobs, population",
  }
  private searchConfig: any = {}

  constructor(props: any) {
    super(props)

    const { cookies, alias, longName } = props
    const kuky = cookies.get(this.hsCookie) || false
    this.searchConfig = {
      getAPiUrl: "https://micro.id.com.au/api/search",
      getClientAlias: alias,
      getClientLongName: longName,
      getTrackingID: "UA-27808229-2",
    }

    this.state = {
      results: [],
      currentTab: 0,
      searchTerms: "",
      searchOption: "place",
      currentResultTerm: "",
      inProgress: false,
      noResults: false,
      showSearch: false,
      tabs: [],
      hasRegistered: kuky,
      placeholder: "e.g Adelaide",
    }
  }

  componentDidMount() {
    // if href has query string we want to trigger a search
    if (!_.isUndefined(window.location.href.split("#")[1])) {
      const hashParams = getHashParams()
      const searchTerm = hashParams["s"]
      const searchOption = hashParams["o"]
      this.handleOptionSwitch(searchOption)
      this.setState({ searchOption }, () => {
        if (searchTerm) {
          this.search(searchTerm)
        }
      })
    }
  }

  // great switch statement alternative btw
  private getSearchEndPoint = searchOption => {
    const searchOptionsApis = {
      place:
        this.searchConfig.getAPiUrl +
        "/place/" +
        this.searchConfig.getClientAlias +
        "/",
      topic:
        this.searchConfig.getAPiUrl +
        "/topic/" +
        this.searchConfig.getClientAlias +
        "/" +
        this.searchConfig.getWebId +
        "/",
    }
    return searchOptionsApis[searchOption] || searchOptionsApis.place
  }

  private searchFocus = () => {
    this.setState({
      showSearch: true,
    })
  }

  private search = term => {
    const { searchOption } = this.state

    this.setState({
      inProgress: true,
      noResults: false,
    })

    const query = this.getSearchEndPoint(searchOption) + term

    fetch(query)
      .then(response => response.json())
      .then(data => {
        this.initialSearchResults = data.results
        this.setState({
          currentResultTerm: term,
          results: data.results,
          searchTerms: term,
          showSearch: true,
          inProgress: false,
          noResults: data.results.length === 0,
          tabs: data.products,
        })

        if (data.results.length > 0) {
          this.filterResultsByTab()
          this.setUri()
        }
      })
      .catch(error =>
        this.setState({
          results: [],
          inProgress: false,
        })
      )
  }

  // when searching we need to populate the uri with queries to remember search terms
  private setUri = () => {
    const { searchOption, searchTerms } = this.state
    const host = window.location.href.split("#")[0]
    window.location.href = host + `#o=${searchOption}&s=${searchTerms}`
  }

  private handleOptionSwitch = option => {
    this.setState({
      results: [],
      searchTerms: "",
      searchOption: option,
      placeholder: this.searchOptionPlaceholders[option],
    })
  }

  private closeSearch = () => {
    this.setState({
      results: [],
      showSearch: false,
      searchTerms: "",
      noResults: false,
    })
  }

  private updateTerms = searchTerms => {
    this.setState({ searchTerms })
  }

  private filterResultsByTab = (id?: number): void => {
    const { currentTab } = this.state
    id = !_.isUndefined(id) ? id : currentTab
    const results =
      id === 0
        ? this.initialSearchResults
        : _.filter(
            this.initialSearchResults,
            (result: any) => result.productID === id
          )
    this.setState({
      results,
      currentTab: id,
    })
  }

  render() {
    const {
      searchOption,
      searchTerms,
      inProgress,
      results,
      hasRegistered,
      currentTab,
      tabs,
      noResults,
      placeholder,
      showSearch,
    } = this.state

    const showSearchClassName = showSearch
      ? styles.searchopened
      : styles.searchclosed

    return (
      <React.Fragment>
        <HeaderID>
          <FauxWrapper>
            <IDentity
              className="id-identity"
              href="http://home.id.com.au/demographic-resources/"
              target="_BLANK"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 50">
                <title>idc-logo</title>
                <path
                  d="M143.84,18.19h1.57V29.54a11.26,11.26,0,0,0,.07,1.6H144l-.09-.88a2.54,2.54,0,0,1-2.16,1.1c-2.09,0-3-1.51-3-4.61,0-3.26.9-4.86,3-4.86a2.42,2.42,0,0,1,2.16,1.22Zm-3.53,8.41c0,2.47.38,3.6,1.8,3.6,1.26,0,1.73-1.15,1.73-3.55s-.47-3.46-1.82-3.46C140.85,23.2,140.31,24.31,140.31,26.6Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M150.23,31.37c-2.54,0-3.39-1.53-3.39-4.81s1-4.65,3.39-4.65,3.24,1.19,3.24,3.67V27h-5v.52c0,1.73.5,2.54,1.78,2.54.94,0,1.55-.61,1.69-1.73h1.55A3,3,0,0,1,150.23,31.37Zm1.71-5.55v-.77c0-1.37-.58-2.07-1.66-2.07-1.24,0-1.8.92-1.84,2.84Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M158.78,21.9a2.31,2.31,0,0,1,2.32,1.51,2.64,2.64,0,0,1,2.5-1.51A2.23,2.23,0,0,1,166,24.33v6.82h-1.55V25.38c0-1.55-.27-2.29-1.5-2.29s-1.76,1-1.76,2.84v5.22h-1.57V25.38c0-1.55-.27-2.29-1.5-2.29s-1.76,1-1.76,2.84v5.22h-1.55V23.54a13.78,13.78,0,0,0-.09-1.42h1.58l.07,1A2.75,2.75,0,0,1,158.78,21.9Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M170.79,21.92c2.45,0,3.38,1.49,3.38,4.72s-.94,4.74-3.38,4.74-3.4-1.49-3.4-4.75S168.36,21.92,170.79,21.92ZM169,26.64c0,2.34.43,3.42,1.8,3.42s1.8-1.08,1.8-3.4-.43-3.42-1.8-3.42S169,24.33,169,26.64Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M177.68,32.16a1.25,1.25,0,0,0,1.3,1.35c1.3,0,1.55-.7,1.55-2.09v-1.3a2.65,2.65,0,0,1-2.16,1.24c-2.12,0-3-1.58-3-4.86,0-3.1.88-4.63,3-4.63a2.57,2.57,0,0,1,2.18,1.1l.09-.86h1.57a11,11,0,0,0-.09,1.6v7.92a3.09,3.09,0,0,1-.52,2.09,3,3,0,0,1-2.61,1c-1.89,0-3-.92-3-2.52Zm1-2.11c1.35,0,1.89-1.13,1.89-3.46S180.13,23,178.76,23,177,24.17,177,26.6,177.43,30.06,178.71,30.06Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M185.3,23.29a2.19,2.19,0,0,1,2.27-1.4l.29,0v1.58l-.4,0c-1.58,0-2.16.65-2.16,2.21v5.47h-1.55V23.63c0-.13-.05-.63-.14-1.53h1.55Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M188.43,24.48V24.3c0-1.57,1.1-2.4,3.21-2.4s3,.83,3,2.63v4.21a17.45,17.45,0,0,0,.16,2.41h-1.55L193.18,30a3,3,0,0,1-2.34,1.22,2.56,2.56,0,0,1-2.59-2.77c0-2.07,1.35-3.13,4-3.13h.86v-.45c0-1.3-.27-1.87-1.39-1.87s-1.66.47-1.66,1.37v.09Zm1.37,3.85a1.45,1.45,0,0,0,1.42,1.55c1.17,0,1.93-.92,1.93-2.75v-.7C190.8,26.42,189.8,26.85,189.8,28.33Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M196.29,23.72a11.24,11.24,0,0,0-.07-1.6h1.58l.09.86a2.52,2.52,0,0,1,2.12-1.1c2.09,0,3,1.53,3,4.63,0,3.26-.9,4.86-3,4.86a2.43,2.43,0,0,1-2.16-1.24v4.45h-1.57Zm3.4,6.34c1.21,0,1.67-1.13,1.67-3.46S201,23,199.59,23s-1.75,1.17-1.75,3.64C197.84,28.94,198.38,30.06,199.69,30.06Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M209.2,25.38c0-1.55-.27-2.29-1.49-2.29s-1.76,1-1.76,2.84v5.22h-1.55v-13h1.55v5a2.78,2.78,0,0,1,2.41-1.26,2.25,2.25,0,0,1,2.41,2.43v6.82H209.2Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M212.49,18.19H214v1.66h-1.5Zm0,3.93H214v9h-1.5Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M222.2,28.1a3,3,0,0,1-3.26,3.28c-2.45,0-3.38-1.48-3.38-4.72s.94-4.73,3.38-4.73c1.94,0,3.21,1.13,3.21,2.79v.2h-1.53A1.49,1.49,0,0,0,219,23.23c-1.48,0-1.89,1.06-1.89,3.42s.43,3.4,1.8,3.4c1,0,1.66-.74,1.69-2Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M229,23.29a2.19,2.19,0,0,1,2.27-1.4l.29,0v1.58l-.4,0c-1.58,0-2.16.65-2.16,2.21v5.47h-1.55V23.63c0-.13-.05-.63-.14-1.53h1.55Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M235.5,31.37c-2.54,0-3.39-1.53-3.39-4.81s1-4.65,3.39-4.65,3.24,1.19,3.24,3.67V27h-5v.52c0,1.73.5,2.54,1.78,2.54.94,0,1.55-.61,1.69-1.73h1.55A3,3,0,0,1,235.5,31.37Zm1.71-5.55v-.77c0-1.37-.58-2.07-1.66-2.07-1.24,0-1.8.92-1.84,2.84Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M241.44,28.4c0,1.12.56,1.69,1.53,1.69s1.48-.49,1.48-1.21c0-.56-.41-1-1.31-1.44l-1.64-.85c-1.12-.58-1.62-1.13-1.62-2.13,0-1.53,1.22-2.59,3.13-2.59s3,.94,3,2.41v.16h-1.66A1.33,1.33,0,0,0,242.86,23a1.21,1.21,0,0,0-1.37,1.13c0,.49.31.79.92,1.1l1.49.74c1.51.76,2.21,1.37,2.21,2.61,0,1.66-1.24,2.75-3.21,2.75s-3.15-1-3.17-3Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M250.6,21.92c2.45,0,3.38,1.49,3.38,4.72s-.94,4.74-3.38,4.74-3.4-1.49-3.4-4.75S248.17,21.92,250.6,21.92Zm-1.8,4.72c0,2.34.43,3.42,1.8,3.42s1.8-1.08,1.8-3.4-.43-3.42-1.8-3.42S248.8,24.33,248.8,26.64Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M256.92,27.88c0,1.55.27,2.29,1.49,2.29s1.76-.94,1.76-2.83V22.12h1.55v7.62a13.78,13.78,0,0,0,.09,1.42h-1.58l-.07-1.06a2.77,2.77,0,0,1-2.39,1.28,2.25,2.25,0,0,1-2.41-2.43V22.12h1.57Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M264.94,23.29a2.19,2.19,0,0,1,2.27-1.4l.29,0v1.58l-.4,0c-1.58,0-2.16.65-2.16,2.21v5.47H263.4V23.63c0-.13-.05-.63-.14-1.53h1.55Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M274.66,28.1a3,3,0,0,1-3.26,3.28c-2.45,0-3.39-1.48-3.39-4.72s.94-4.73,3.39-4.73c1.94,0,3.21,1.13,3.21,2.79v.2h-1.53a1.49,1.49,0,0,0-1.58-1.67c-1.48,0-1.89,1.06-1.89,3.42s.43,3.4,1.8,3.4c1,0,1.66-.74,1.69-2Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M279.16,31.37c-2.54,0-3.39-1.53-3.39-4.81s1-4.65,3.39-4.65,3.24,1.19,3.24,3.67V27h-5v.52c0,1.73.5,2.54,1.78,2.54.94,0,1.55-.61,1.69-1.73h1.55A3,3,0,0,1,279.16,31.37Zm1.71-5.55v-.77c0-1.37-.58-2.07-1.66-2.07-1.24,0-1.8.92-1.84,2.84Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M285.1,28.4c0,1.12.56,1.69,1.53,1.69s1.48-.49,1.48-1.21c0-.56-.41-1-1.31-1.44l-1.64-.85c-1.12-.58-1.62-1.13-1.62-2.13,0-1.53,1.22-2.59,3.13-2.59s3,.94,3,2.41v.16H288A1.33,1.33,0,0,0,286.53,23a1.21,1.21,0,0,0-1.37,1.13c0,.49.31.79.92,1.1l1.49.74c1.51.76,2.21,1.37,2.21,2.61,0,1.66-1.24,2.75-3.21,2.75s-3.15-1-3.17-3Z"
                  style={{ fill: "#757575" }}
                />
                <line
                  x1="129.73"
                  y1="15.65"
                  x2="129.73"
                  y2="37.91"
                  style={{
                    fill: "none",
                    stroke: "#dedede",
                    strokeMiterlimit: 10,
                  }}
                />
                <path
                  d="M81.16,20.51v8a4.75,4.75,0,0,0,.46,2.5,1.82,1.82,0,0,0,1.61.68,2,2,0,0,0,1.86-.94,5.82,5.82,0,0,0,.59-3V20.51h2.15V31.1q0,.42,0,.91T88,33.08H85.77l-.11-1.48A4.42,4.42,0,0,1,84.2,33a3.87,3.87,0,0,1-1.86.43,3.31,3.31,0,0,1-2.46-.91A3.36,3.36,0,0,1,79,30V20.51Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M34.24,28.83h2.17a4.68,4.68,0,0,1-1.23,3.36,4.44,4.44,0,0,1-3.3,1.2,4.13,4.13,0,0,1-3.6-1.54q-1.11-1.54-1.11-5t1.11-5a4.12,4.12,0,0,1,3.6-1.55,4.75,4.75,0,0,1,3.23,1.07,3.56,3.56,0,0,1,1.23,2.82v.27H34.22a2.39,2.39,0,0,0-.58-1.71,2.48,2.48,0,0,0-3.66.44,8.1,8.1,0,0,0-.6,3.71A8.27,8.27,0,0,0,30,30.48a2,2,0,0,0,1.93,1.08,2.12,2.12,0,0,0,1.69-.74A3.09,3.09,0,0,0,34.24,28.83Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M37.41,26.78a8.61,8.61,0,0,1,1.13-5,4.16,4.16,0,0,1,3.6-1.55,4.12,4.12,0,0,1,3.6,1.55q1.11,1.55,1.11,5t-1.12,5a4.11,4.11,0,0,1-3.59,1.56,4.14,4.14,0,0,1-3.61-1.56Q37.41,30.28,37.41,26.78Zm4.73-4.71a2,2,0,0,0-1.94,1.1,8.14,8.14,0,0,0-.59,3.63,8.28,8.28,0,0,0,.59,3.67,2,2,0,0,0,1.94,1.09,2,2,0,0,0,1.93-1.09,8.29,8.29,0,0,0,.58-3.64,8.37,8.37,0,0,0-.58-3.68A2,2,0,0,0,42.14,22.07Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M50.27,22a4.31,4.31,0,0,1,1.46-1.34,4,4,0,0,1,1.87-.42,3.61,3.61,0,0,1,2,.56,3,3,0,0,1,1.2,1.55,3.94,3.94,0,0,1,1.42-1.57,3.88,3.88,0,0,1,2.06-.53,3.26,3.26,0,0,1,2.44.91,3.39,3.39,0,0,1,.89,2.48v9.49H61.48v-8A4.79,4.79,0,0,0,61,22.54a1.82,1.82,0,0,0-1.62-.68,2,2,0,0,0-1.85,1,5.87,5.87,0,0,0-.59,3v7.26H54.78v-8a4.73,4.73,0,0,0-.47-2.51,1.82,1.82,0,0,0-1.61-.68,2,2,0,0,0-1.87.95,5.92,5.92,0,0,0-.59,3v7.26H48.09V22.5c0-.27,0-.57,0-.89S48,20.92,48,20.52h2.2Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M96.17,33.09v-8a4.73,4.73,0,0,0-.47-2.51,1.82,1.82,0,0,0-1.61-.68,2,2,0,0,0-1.87.95,5.92,5.92,0,0,0-.59,3v7.26H89.48V22.5c0-.27,0-.57,0-.89s-.05-.69-.09-1.09h2.2l.1,1.46a4.31,4.31,0,0,1,1.46-1.34A4,4,0,0,1,95,20.21a3.31,3.31,0,0,1,2.46.91,3.36,3.36,0,0,1,.91,2.48v9.49Z"
                  style={{ fill: "#757575" }}
                />

                <path
                  d="M100.19,17.43v-2.3h2.08v2.3Zm0,15.73V20.58h2.08V33.16Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M107.14,17v3.56h2.51v1.55h-2.51v7.53a2.31,2.31,0,0,0,.31,1.4,1.41,1.41,0,0,0,1.14.39q.29,0,1,0h.07V33q-.5.11-.94.16a6.53,6.53,0,0,1-.82.06,3.2,3.2,0,0,1-2.24-.62,3,3,0,0,1-.65-2.2V22.14h-4.77V20.58H105V18.05Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M115.36,37.91h-2.13l1.38-4.76L110.3,20.58h2.53l3,9.94,3-9.94h2.32Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M76.45,21.12A3.26,3.26,0,0,0,74,20.21a3.88,3.88,0,0,0-2.06.53,3.94,3.94,0,0,0-1.42,1.57,3,3,0,0,0-1.2-1.55,3.61,3.61,0,0,0-2-.56,4,4,0,0,0-1.87.42,4.89,4.89,0,0,0-1.65,1.62A4.2,4.2,0,0,1,64,23.6v1.23a4.64,4.64,0,0,1,.55-2,2,2,0,0,1,1.87-.95,1.82,1.82,0,0,1,1.61.68,4.73,4.73,0,0,1,.47,2.51v8h2.18V25.82a5.87,5.87,0,0,1,.59-3,2,2,0,0,1,1.85-1,1.82,1.82,0,0,1,1.62.68,4.79,4.79,0,0,1,.46,2.51v8h2.15V23.6A3.39,3.39,0,0,0,76.45,21.12Z"
                  style={{ fill: "#757575" }}
                />
                <path
                  d="M7.92,14.53h3.8v3.3H7.92Zm3.8,5.67V33.27H7.92V20.2Z"
                  style={{ fill: "#212121" }}
                />
                <path
                  d="M22.26,31.39a4.51,4.51,0,0,1-3.93,2.13C15.26,33.53,13,31,13,26.74S15.18,20,18.28,20a4.41,4.41,0,0,1,3.93,2V14.53H26V30.64a17.64,17.64,0,0,0,.13,2.63H22.39ZM19.5,31c1.67,0,2.78-1.54,2.78-4.24s-1.12-4.27-2.78-4.27S16.84,24,16.84,26.76,17.86,31,19.5,31Z"
                  style={{ fill: "#212121" }}
                />
                <path
                  d="M4.85,33.43a1.92,1.92,0,1,0-1.92-1.92,1.92,1.92,0,0,0,1.92,1.92"
                  style={{ fill: "#ff4612" }}
                />
              </svg>
            </IDentity>
            {!showSearch && (
              <SearchInputFaux>
                <SearchInit
                  id="idSearchInit"
                  type="text"
                  maxlength="100"
                  placeholder="Search for places, topics..."
                  onFocus={this.searchFocus}
                />
              </SearchInputFaux>
            )}
          </FauxWrapper>
        </HeaderID>
        <MainSearchWrapper className={showSearchClassName}>
          <SearchInputWrapper>
            <SearchTermInputContainer>
              <SearchTermInput>
                <OptionSwitch
                  activeOption={searchOption}
                  onSwitch={this.handleOptionSwitch}
                  client={this.searchConfig.getClientLongName}
                />
                <SearchInput
                  searchOption={searchOption}
                  searchTerms={searchTerms}
                  onUserInput={this.updateTerms}
                  onSearch={this.search}
                  onSearchFocus={this.searchFocus}
                  inProgress={inProgress}
                  close={this.closeSearch}
                  placeholder={placeholder}
                />
                <CloseButton
                  handleClick={this.closeSearch}
                  clientLongName={this.searchConfig.getClientLongName}
                />
              </SearchTermInput>
            </SearchTermInputContainer>
          </SearchInputWrapper>

          <ResultsContainer>
            <ResultScroller>
              <SearchResults
                noResults={noResults}
                results={results}
                tabs={tabs}
                currentTab={currentTab}
                filter={this.filterResultsByTab}
                countTotal={this.initialSearchResults.length}
                searchOption={searchOption}
                hasRegistered={hasRegistered}
                client={this.searchConfig.getClientLongName}
                clientLogo={this.props.clientImage}
              />
            </ResultScroller>
            {results.length > 0 && <div className={styles.underlay} />}
          </ResultsContainer>
        </MainSearchWrapper>
      </React.Fragment>
    )
  }
}

export default withCookies(SearchApp)
