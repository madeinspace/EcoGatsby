/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import ClientHeader from "./ClientHeader"
import { Location } from "@reach/router"
import Header from "./header"
import SearchApp from "./search/_Search"
import styled from "styled-components"
import SharedFooter from "./SharedFooter"
import { Share } from "./Actions"

const HeaderRow = styled.div`
  display: grid;
  @media screen and (min-width: 1000px) {
    grid-template-columns: 1fr 180px 780px 1fr;
  }
  @media screen and (min-width: 1200px) {
    grid-template-columns: 1fr 220px 920px 1fr;
  }
  grid-template-areas: ". header header .";
`

const ContentRow = styled(HeaderRow)`
  grid-template-areas: ". navigation content .";
`
const FooterRow = styled(HeaderRow)`
  grid-template-areas: ". footer footer .";
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 220px 920px 1fr;
  grid-gap: 15px;
  grid-template-rows: auto;
  grid-template-areas:
    "header header header header"
    ". content content ."
    "footer footer footer footer";
`

const foo = `
  margin: "0 auto";
  max-width: 960;
  padding: "0px 1.0875rem 1.45rem";
  padding-top: 0;
`
const SiteSearch = styled.div`
  grid-area: search;
`
const SiteHeader = styled.div`
  grid-area: header;
`

const SidebarNav = styled.div`
  grid-area: navigation;
`

const SiteContent = styled.div`
  grid-area: content;
`

const Footer = styled.footer`
  grid-area: footer;
`

const IndexLayout = ({ children, data }) => {
  return (
    <React.Fragment>
      <Row>
        <SiteHeader>
          <Header siteTitle={"Find your economic profile…"} />
        </SiteHeader>

        <SiteContent>{children}</SiteContent>
      </Row>
      <SharedFooter />
    </React.Fragment>
  )
}

IndexLayout.propTypes = {
  data: PropTypes.any,
  children: PropTypes.node.isRequired,
}

export default IndexLayout
