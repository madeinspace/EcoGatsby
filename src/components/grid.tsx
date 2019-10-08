import React from "react"
import styled from "styled-components"

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 240px 720px 1fr;
  @media screen and (min-width: 960px) {
    grid-template-columns: 1fr 240px 720px 1fr;
  }
  @media screen and (min-width: 1200px) {
    grid-template-columns: 1fr 280px 920px 1fr;
  }
  grid-template-areas: ". header header .";
`

export const ContentRow = styled(HeaderRow)`
  grid-gap: 0 15px;
  grid-template-areas: ". navigation content .";
`
export const BaseFooterRow = styled.div`
  display: grid;
  @media screen and (min-width: 960px) {
    grid-template-columns: 1fr 160px 160px 160px 160px 160px 160px 1fr;
  }
  @media screen and (min-width: 1200px) {
    grid-template-columns: 1fr 200px 200px 200px 200px 200px 200px 1fr;
  }
  grid-column-gap: 15px;
`
export const FooterRow = styled(BaseFooterRow)`
  grid-template-areas: ". footer footer footer footer footer footer .";
`

export const SiteMapGrid = styled(BaseFooterRow)`
  grid-template-areas: ". col1 col2 col3 col4 col5 col6 .";
`
