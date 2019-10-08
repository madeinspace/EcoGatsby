import * as _ from "lodash"
import * as React from "react"
import { SearchButton } from "./SearchButton"
const styles = require("./search.module.scss")

interface ISearchInputProps {
  onSearchFocus: any
  placeholder: string
  searchTerms: string
  searchOption: string
  inProgress: boolean
  close: () => void
  onSearch: (searchTerms: string) => void
  onUserInput: (searchTerms: string) => void
}

interface ISearchInputState {
  charCount: number
}

class SearchInput extends React.Component<
  ISearchInputProps,
  ISearchInputState
> {
  constructor(props: Readonly<ISearchInputProps>) {
    super(props)

    this.state = {
      charCount: 0,
    }
  }

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyboardEvent, false)
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyboardEvent, false)
  }

  private handleChange = () => {
    const { onUserInput } = this.props
    const searchTerms = this.refs.searchTermsInput["value"]
    this.setState({ charCount: searchTerms.length })
    onUserInput(searchTerms)
  }

  private handleKeyboardEvent = event => {
    const { close, searchTerms } = this.props
    // 13 return or enter key
    if (event.keyCode === 13) {
      this.triggerSearch(searchTerms)
    } //escape
    if (event.keyCode === 27) {
      close()
    }
  }

  private triggerSearch = searchTerms => {
    const { onSearch } = this.props
    const { charCount } = this.state
    if (charCount > 2) {
      onSearch(searchTerms)
    }
  }

  private onSearchButtonClick = () => {
    const searchTerms = this.refs.searchTermsInput["value"]
    this.triggerSearch(searchTerms)
  }

  public render() {
    const { placeholder, searchTerms, inProgress } = this.props

    return (
      <div className={styles.searchInputContainer}>
        <input
          maxLength={100}
          type="text"
          className={styles.headerSearchForm__input}
          placeholder={placeholder}
          value={searchTerms}
          ref="searchTermsInput"
          onKeyUp={this.handleChange}
          onChange={this.handleChange}
        />

        <SearchButton
          inProgress={inProgress}
          handleClick={this.onSearchButtonClick}
        />
      </div>
    )
  }
}
export default SearchInput
