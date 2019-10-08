import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import ClientProductsNav from "./ClientProductsNav"
import { HeaderRow } from "./grid"
import Img from "gatsby-image"

const ClientLogo = styled.div`
  align-self: flex-end;
`

const Header = styled.div`
  margin-top: 1em;
  height: 128px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Stack = styled.div`
  height: 128px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Title = styled.div`
  display: inline-flex;
`
const Separator = styled.span`
  margin: 0 10px;
  &::before {
    content: "|";
    font-size: 24px;
  }
`
const ClientName = styled.h1`
  color: #333;
  font-size: 28px;
  text-decoration: none;
  margin: 0;
  line-height: initial;
`

const ProductName = styled.h1`
  font-size: 28px;
  color: #038539;
  margin: 0;
  text-decoration: none;
  line-height: initial;
`
const Decoration = styled.div`
  padding: 40px 0;
  &::after {
    display: block;
    content: "";
    background: #e7e7e7;
    height: 1px;
    margin-top: -1px;
  }
`

const HeaderWrapper = styled.div`
  grid-area: header;
`

export const ClientHeader = ({
  alias,
  longName,
  products,
  isLite,
  clientImage,
}) => (
  <Decoration>
    <HeaderRow>
      <HeaderWrapper>
        <Header>
          <Stack>
            <Title>
              <ClientName>{longName} </ClientName>
              <Separator />
              <ProductName>economic profile{isLite && " (lite)"}</ProductName>
            </Title>
            <ClientProductsNav products={products} alias={alias} />
          </Stack>
          <ClientLogo>
            <Img
              fixed={clientImage}
              alt={`${longName} Logo`}
              title={longName}
            />
          </ClientLogo>
        </Header>
      </HeaderWrapper>
    </HeaderRow>
  </Decoration>
)

ClientHeader.propTypes = {
  clientID: PropTypes.number,
  name: PropTypes.string,
  alias: PropTypes.string,
  longName: PropTypes.string,
  logoUrl: PropTypes.string,
}

ClientHeader.defaultProps = {
  name: ``,
  alias: ``,
  longName: ``,
  logoUrl: ``,
}

export default ClientHeader
