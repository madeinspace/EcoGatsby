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
import MainNavigation from "./MainNavigation"
import styled from "styled-components"
import { ContentRow } from "./grid"
import SiteMap from "./SiteMap"
import SharedFooter from "./SharedFooter"
import some from "lodash/some"
import SiblingsMenu from "./SiblingsMenu"

const SidebarNav = styled.div`
  grid-area: navigation;
`

const SiteContent = styled.div`
  grid-area: content;
`

const IsLite = ({ allMainNavigation: { nodes } }) => some(nodes, "Disabled")

const Layout = ({ children, data }) => {
  return (
    <React.Fragment>
      <Location>
        {({ location }) => {
          return location.pathname === "/" ? (
            <Header siteTitle={"Find your economic profile…"} />
          ) : (
            <React.Fragment>
              <SearchApp
                alias={data.client.Alias}
                clientID={data.client.ClientID}
                longName={data.client.LongName}
                clientImage={data.clientLogo.imageData.fixed}
              />
              <ClientHeader
                alias={data.client.Alias}
                name={data.client.Name}
                longName={data.client.LongName}
                products={data.allClientProducts.nodes}
                clientID={data.client.ClientID}
                clientImage={data.clientLogo.imageData.fixed}
                isLite={IsLite(data)}
              />
            </React.Fragment>
          )
        }}
      </Location>
      <ContentRow>
        <SidebarNav>
          <MainNavigation
            alias={data.client.Alias}
            navigationNodes={data.allMainNavigation.nodes}
          />
        </SidebarNav>
        <SiteContent>
          <SiblingsMenu
            navigationNodes={data.allMainNavigation.nodes}
            clientAlias={data.client.Alias}
          />
          {children}
        </SiteContent>
      </ContentRow>
      <SiteMap
        alias={data.client.Alias}
        colGroups={data.allSitemapGroups.nodes}
        longName={data.client.LongName}
        products={data.allClientProducts.nodes}
        navigationNodes={data.allMainNavigation.nodes}
      />
      <SharedFooter />
    </React.Fragment>
  )
}

Layout.propTypes = {
  data: PropTypes.any,
  children: PropTypes.node.isRequired,
}

export default Layout
