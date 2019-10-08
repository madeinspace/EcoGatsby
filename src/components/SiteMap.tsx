import React from "react"
import styled from "styled-components"
import groupBy from "lodash/groupBy"
import { pathParts, IsGatsbyPage } from "./Utils"
import _ from "lodash"
import { Link } from "@reach/router"
import { Location } from "@reach/router"
import { FooterRow, SiteMapGrid } from "./grid"
const variables = require(`sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/variables.scss`)

const SiteMapHeader = styled.h1`
  margin: 0;
  padding-bottom: 15px;
  padding-top: 1em;
  font-size: 26px;
  border-bottom: 1px solid #d2d2d2;
`
const Subtitle = styled.h2`
  color: #70b859;
  font-size: 20px;
  padding-top: 1em;
`

const FooterContents = styled.div`
  grid-area: footer;
  margin: 0;
`

const SitemapWrapper = styled.div`
  background-color: ${variables.grayLightest};
  margin-top: 40px;
  padding-bottom: 1.5em;
`

const ProductItems = styled.ul`
  margin: 0;
  list-style: none;
  grid-area: footer;
`
const ProductItem = styled.li`
  position: relative;
  line-height: 30px;
  vertical-align: middle;
  text-decoration: none;
  text-transform: lowercase;
  font-size: 16px;
  a {
    text-decoration: none;
  }
  &.app-1 {
    a {
      color: ${variables.colorProfile};
    }
  }
  &.app-2 {
    a {
      color: ${variables.colorAtlas};
    }
  }
  &.app-3 {
    a {
      color: ${variables.colorForecast};
    }
  }
  &.app-4 {
    a {
      color: ${variables.colorEconomy};
    }
  }
`

const GroupName = styled.h2`
  font-size: 11px;
  letter-spacing: 0.1em;
  margin-bottom: 5px;
  margin-top: 5px;
  text-transform: uppercase;
  line-height: 20px;
  color: #70b859;
`

const PageList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`
const PageItem = styled.li`
  font-size: 11px;
  line-height: 16px;
`
const DisabledLink = styled(PageItem)`
  color: ${variables.grayLight};
  text-decoration: none;
  cursor: default;
`

const MonolithOrGatsbyLink = props => {
  const { to, children, style, className } = props
  return IsGatsbyPage(to) ? (
    <Link {...props} />
  ) : (
    <a
      href={`https://economy.id.com.au${to}`}
      {...{ children, style, className }}
    />
  )
}

const StyledLink = styled(MonolithOrGatsbyLink)`
  font-size: 11px;
  line-height: 16px;
  text-decoration: none;
  color: ${variables.gray};
  display: block;
  &:hover {
    text-decoration: underline;
  }
`

const ColumnGroup = styled.div`
  margin-top: 10px;
`

const Column = styled.div`
  grid-area: ${props => `col${props.col}`};
`

const buildSiteMap = (clientAlias, columns, navigationNodes) => {
  return columns.map((column, i) => {
    return (
      <Column key={i} col={i + 1}>
        {column.map((groups, i) => {
          const pageIDs = groups.Pages.split(",").map(Number)
          const pages = navigationNodes.filter(node =>
            pageIDs.includes(node.PageID)
          )
          return (
            <ColumnGroup key={i}>
              <GroupName>{groups.GroupName}</GroupName>
              <PageList>
                {pages.map((page, i) => {
                  const { Alias: pageAlias, PageID, MenuTitle, Disabled } = page
                  return (
                    <React.Fragment key={PageID}>
                      {Disabled ? (
                        <DisabledLink>{MenuTitle}</DisabledLink>
                      ) : (
                        <li>
                          <StyledLink to={`/${clientAlias}/${pageAlias}/`}>
                            {MenuTitle}
                          </StyledLink>
                        </li>
                      )}
                    </React.Fragment>
                  )
                })}
              </PageList>
            </ColumnGroup>
          )
        })}
      </Column>
    )
  })
}

const SiteMap = ({ alias, products, longName, navigationNodes, colGroups }) => {
  const columns = _.values(groupBy(colGroups, "ColNumber"))
  return (
    <SitemapWrapper>
      <FooterRow>
        <FooterContents>
          <SiteMapHeader>{longName}</SiteMapHeader>
        </FooterContents>
      </FooterRow>
      <FooterRow>
        <FooterContents>
          <Subtitle>economic profile</Subtitle>
        </FooterContents>
      </FooterRow>
      <SiteMapGrid>{buildSiteMap(alias, columns, navigationNodes)}</SiteMapGrid>
      <FooterRow>
        <ProductItems>
          {products
            .filter(p => p.ApplicationID != 4)
            .map((product, i) => {
              return (
                <ProductItem key={i} className={`app-${product.ApplicationID}`}>
                  <a
                    key={i}
                    href={`https://${product.SubDomainName}.id.com.au/${alias}`}
                  >
                    {product.ProductName}
                  </a>
                </ProductItem>
              )
            })}
        </ProductItems>
      </FooterRow>
    </SitemapWrapper>
  )
}
export default SiteMap
