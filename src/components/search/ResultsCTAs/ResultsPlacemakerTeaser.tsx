import * as React from "react"
const styles = require("./search.module.scss")

export interface ResultsPlacemakerTeaserProps {}

export function ResultsPlacemakerTeaser(props: ResultsPlacemakerTeaserProps) {
  return (
    <div className={styles.learnplacemaker + "hidden"}>
      <h2 className="h3">Can’t find the place you’re looking for? </h2>
      <p>
        Placemaker Explorer has data for all of Australia, down to local detail.{" "}
      </p>
      <p>
        <a
          className="btn btn-primary"
          target="_BLANK"
          href="https://home.id.com.au/census-explorer/"
        >
          Learn about Placemaker explorer
        </a>
      </p>
    </div>
  )
}
