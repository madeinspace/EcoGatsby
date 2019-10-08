import React from "react"
import { pathParts, IsGatsbyPage } from "./Utils"
import { Link } from "gatsby"
import { Location } from "@reach/router"
import styled from "styled-components"
const variables = require(`sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/variables.scss`)

const SiblingsMenu = ({ navigationNodes, clientAlias }) => {
  return (
    <SiblingsMenuContainer>
      <Location>
        {({ location: { pathname } }) => {
          const { pageAlias: currentPageAlias } = pathParts(pathname)
          const currentPageNode = navigationNodes.find(
            node => node.Alias === currentPageAlias
          )
          const currentParentPageID =
            (currentPageNode && currentPageNode.ParentPageID) || 0
          const siblings = navigationNodes
            .filter(node => {
              return node.ParentPageID === currentParentPageID
            })
            .map((node, i) => {
              const { Disabled, MenuTitle, Alias } = node
              return (
                <React.Fragment key={i}>
                  {Disabled ? (
                    <DisabledLink>{MenuTitle}</DisabledLink>
                  ) : (
                    <StyledLink
                      partiallyActive={true}
                      to={`/${clientAlias}/${Alias}`}
                      activeClassName={"active"}
                    >
                      {MenuTitle}
                    </StyledLink>
                  )}
                </React.Fragment>
              )
            })
          return <React.Fragment>{siblings}</React.Fragment>
        }}
      </Location>
    </SiblingsMenuContainer>
  )
}

export default SiblingsMenu

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

const SiblingsMenuContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${variables.grayLighter};
`

const StyledLink = styled(MonolithOrGatsbyLink)`
  text-decoration: none;
  color: ${variables.gray};
  padding: 0px 12px 0 12px;
  margin-bottom: 10px;
  border-bottom: 2px solid transparent;
  &.active,
  :hover {
    border-bottom: 2px solid ${variables.colorEconomy};
  }
`

const DisabledLink = styled.a`
  padding: 0px 12px 0 12px;
  margin-bottom: 10px;
  color: ${variables.grayLight};
  text-decoration: none;
  cursor: default;
  :hover {
    border-bottom: 2px solid ${variables.colorEconomy};
  }
`
