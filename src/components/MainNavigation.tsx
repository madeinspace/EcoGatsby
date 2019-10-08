import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { pathParts, IsGatsbyPage } from "./Utils"
import _ from "lodash"
import { Location } from "@reach/router"
import groupBy from "lodash/groupBy"
import OtherResources from "./OtherRessources"
const variables = require(`sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/variables.scss`)
const MainNav = styled.div``

const buildIsCurrent = currentPageAlias => navigationNode =>
  navigationNode.Alias == currentPageAlias

const buildMenuGroups = navNodes => groupBy(navNodes, "GroupName")

const validateGroupName = groupname =>
  groupname !== "" && groupname !== "Undefined"

const buildMenu = (clientAlias, navigationNodes, ParentPageID = 0) => {
  const groupedNavigation = groupBy(navigationNodes, "ParentPageID")
  const topNavNodes = groupedNavigation[ParentPageID]
  const menuGroups = buildMenuGroups(topNavNodes)

  return _.map(menuGroups, (group, groupName) => (
    <React.Fragment key={groupName}>
      {validateGroupName(groupName) && <GroupName>{groupName}</GroupName>}
      {group.map((topNode, i) => {
        const {
          Disabled,
          MenuTitle,
          Alias: pageAlias,
          PageID,
          ParentPageID,
        } = topNode
        const isParent = PageID in groupedNavigation && ParentPageID === 0

        return (
          <MenuItem key={i} className={isParent && "parent"}>
            <Location>
              {({ location: { pathname } }) => {
                const { pageAlias: currentPageAlias } = pathParts(pathname)
                const isCurrent = buildIsCurrent(currentPageAlias)
                const childIsCurrent = _.some(
                  groupedNavigation[PageID],
                  isCurrent
                )
                return (
                  <React.Fragment>
                    {Disabled ? (
                      <DisabledLink>{MenuTitle}</DisabledLink>
                    ) : (
                      <StyledLink
                        partiallyActive={true}
                        activeClassName={"active"}
                        className={childIsCurrent && "active"}
                        to={`/${clientAlias}/${pageAlias}`}
                      >
                        {MenuTitle}
                      </StyledLink>
                    )}
                    {isParent && (
                      <SubMenu>
                        {buildMenu(clientAlias, navigationNodes, PageID)}
                      </SubMenu>
                    )}
                  </React.Fragment>
                )
              }}
            </Location>
          </MenuItem>
        )
      })}
    </React.Fragment>
  ))
}

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
  text-decoration: none;
  color: ${variables.gray};
  display: block;
  padding: 3.5px 7px;
  &.active,
  :hover {
    background-color: ${variables.colorEconomy};
    color: white;
  }
`

const HardCodedLink = styled.a`
  text-decoration: none;
  color: ${variables.gray};
  display: block;
  padding: 3.5px 7px;
  &.active,
  :hover {
    background-color: ${variables.colorEconomy};
    color: white;
  }
`

const DisabledLink = styled.div`
  padding: 3.5px 7px;
  color: ${variables.grayLight};
  text-decoration: none;
  cursor: default;
  :hover {
    background-color: ${variables.colorEconomy};
    color: white;
  }
`

const SubMenu = styled.ul`
  visibility: hidden;
  opacity: 0;
  transition: opacity 300ms ease;
  position: absolute;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  width: 280px;
  padding: 4px;
  top: 0;
  left: 100%;
  z-index: 1000;
  margin-left: -1px;
`

const MenuItem = styled.li`
  font-size: 14px;
  line-height: 1.2;
  display: block;
  color: ${variables.gray};
  position: relative;

  &.parent {
    a,
    div {
      cursor: pointer;
      &::after {
        font-family: "id-icons";
        font-size: 18px;
        line-height: 0;
        content: "\\E603";
        float: right;
        margin-top: 8px;
      }
    }
  }

  &:hover {
    ${SubMenu} {
      visibility: visible;
      opacity: 1;
      ${DisabledLink} {
        cursor: default;
      }
      a,
      div {
        &::after {
          content: "";
        }
      }
    }
  }
`

const GroupName = styled(MenuItem)`
  padding: 3.5px 7px;
  font-size: 16px;
  font-weight: 700;
`

const Menu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  & > ${GroupName} {
    color: ${variables.colorEconomy};
    border-top: solid 1px ${variables.grayLight};
    padding-top: 0.5em;
    margin-top: 0.5em;
  }
`

const MainNavigation = ({ alias, navigationNodes }) => (
  <MainNav>
    <Menu>
      {buildMenu(alias, navigationNodes)}
      <GroupName>Other resources</GroupName>
      {OtherResources.map((link, i) => (
        <MenuItem key={i}>
          <HardCodedLink
            href={link.url}
            target="_blank"
            title={link.displayText}
          >
            {link.displayText}
          </HardCodedLink>
        </MenuItem>
      ))}
    </Menu>
  </MainNav>
)

export default MainNavigation
