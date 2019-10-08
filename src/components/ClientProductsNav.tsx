import React from "react"
import styled from "styled-components"
const variables = require(`sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/variables.scss`)

const ClientProductsNav = ({ products, alias }) => {
  const ProductsNav = styled.nav`
    height: 42px;
  `
  const ActiveIndicator = styled.span`
    display: none;
    position: absolute;
    left: 50%;
    margin-left: -7.5px;
    bottom: -8px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 8px 0;
  `
  const ProductItem = styled.a`
    position: relative;
    height: 42px;
    line-height: 42px;
    float: left;
    vertical-align: middle;
    text-decoration: none;
    padding: 0 14px;
    color: #fff;
    transition: 0.3s background-color;
    text-transform: lowercase;
    font-size: 16px;
    &.app-1 {
      background-color: ${variables.colorProfile};
      ${ActiveIndicator} {
        border-color: ${variables.colorProfile} transparent transparent;
      }
    }
    &.app-2 {
      background-color: ${variables.colorAtlas};
      ${ActiveIndicator} {
        border-color: ${variables.colorAtlas} transparent transparent;
      }
    }
    &.app-3 {
      background-color: ${variables.colorForecast};
      ${ActiveIndicator} {
        border-color: ${variables.colorForecast} transparent transparent;
      }
    }
    &.app-4 {
      background-color: ${variables.colorEconomy};
      ${ActiveIndicator} {
        border-color: ${variables.colorEconomy} transparent transparent;
      }
    }
    &.active {
      ${ActiveIndicator} {
        display: block;
      }
    }

    &:hover {
      ${ActiveIndicator} {
        display: block;
      }
    }
  `

  return (
    <ProductsNav>
      {products.map((product, i) => {
        return (
          <ProductItem
            key={i}
            target="_blank"
            className={`app-${product.ApplicationID} ${
              product.ApplicationID === 4 ? "active" : null
            }`}
            href={`https://${product.SubDomainName}.id.com.au/${alias}`}
          >
            {product.ProductName}
            <ActiveIndicator />
          </ProductItem>
        )
      })}
    </ProductsNav>
  )
}

export default ClientProductsNav
