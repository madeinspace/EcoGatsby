import * as React from "react"
import * as _ from "lodash"

const styles = require("./EntityTable.module.scss")

export const SourceAndTopicNotes = ({ source, anchorName, clientAlias }) =>
  !_.isEmpty(source) && (
    <div className={`${styles.dataTableSource}`}>
      <div>{source}</div>
      <div className={styles.dataNotes}>
        <a
          className="tableFooterNotes"
          target="_blank"
          title="Click for more information"
          href={`https://economy.id.com.au/${clientAlias}/topic-notes#${anchorName}`}
        >
          Please refer to specific data notes for more information
        </a>
      </div>
    </div>
  )

export default SourceAndTopicNotes
