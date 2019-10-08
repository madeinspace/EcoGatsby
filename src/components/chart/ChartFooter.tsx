import * as React from "react"
import styled from "styled-components"
const logo = require("../../images/id_grey.png")
const variables = require(`sass-extract-loader?{"plugins": ["sass-extract-js"]}!../../styles/variables.scss`)

interface IFooterData {
  dataSource: JSX.Element
}

const Footer = styled.div`
  position: relative;
  height: 59px;

  a {
    color: ${variables["linkColor"]};
    text-decoration: none;
    border-bottom: 1px solid ${variables["linkColor"]};
    &:visited {
      color: ${variables["linkColor"]};
    }
  }
`
const DataSourceText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 59px;
  line-height: 14px;
  padding: 8px;
  font-size: 12px;
  width: calc(100% - 92px);
`

const Logo = styled.div`
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 92px;
  background-image: url("${logo}");
  background-repeat: no-repeat;
  height: 41px;
`

export const ChartFooter: React.SFC<IFooterData> = ({ dataSource }) => (
  <Footer>
    <DataSourceText>{dataSource}</DataSourceText>
    <Logo />
  </Footer>
)
