import * as React from "react"
const styles = require("./search.module.scss")

export const SearchButton: React.FunctionComponent<any> = props => {
  const { inProgress, handleClick } = props

  return (
    <button
      type="button"
      className={
        styles.headerSearchForm__btn +
        " " +
        (inProgress ? styles.headerSearchForm__btn__loading : " ")
      }
      onClick={handleClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35">
        <rect fill="white" width="35" height="35" />
        <path
          fill="#949494"
          d="M25.2031,25.7969L20.52,21.1133a6.7647,6.7647,0,0,1-1.8047.9453,6.3739,6.3739,0,0,1-6.5742-1.5254A6.1322,6.1322,0,0,1,10.25,16a6.133,6.133,0,0,1,1.8906-4.5332,6.1919,6.1919,0,0,1,4.5117-1.8691,6.2473,6.2473,0,0,1,4.5547,1.8691A6.14,6.14,0,0,1,23.0977,16a6.2464,6.2464,0,0,1-.3437,2.0625,6.1622,6.1622,0,0,1-.9453,1.7617l4.6836,4.6836Zm-8.5508-5.1992A4.6214,4.6214,0,0,0,21.25,16a4.6214,4.6214,0,0,0-4.5977-4.5977A4.3509,4.3509,0,0,0,13.43,12.7559a4.6165,4.6165,0,0,0,0,6.4883A4.3509,4.3509,0,0,0,16.6523,20.5977Z"
        />
      </svg>
    </button>
  )
}
