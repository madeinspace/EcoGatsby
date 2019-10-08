import * as React from "react"
const styles = require("./search.module.scss")

export const CloseButton: React.FunctionComponent<any> = props => {
  return (
    <div
      id="ms_searchClose"
      className={styles.searchResults__header__closeBtn}
      onClick={props.handleClick}
    >
      <p>Return to {props.clientLongName}</p>
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 23.9771 23.9121"
      >
        <path
          className="searchIconClose"
          d="M17.9336,16.7715l10.0547,9.99-1.9336,1.9336L16,18.7051l-10.0547,9.99L4.0112,26.7617l10.0547-9.99L4.0112,6.7168,5.9448,4.7832,16,14.8379,26.0547,4.7832l1.9336,1.9336Z"
          transform="translate(-4.0112 -4.7832)"
        />
      </svg>
    </div>
  )
}
