import styled from "styled-components"
const variables = require(`sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/variables.scss`)

export const TitleContainer = styled.div`
  color: #5f6062;
`

export const MainTitle = styled.h1`
  font-size: 45px;
  padding: 0;
  margin: 0 0 10px 0;
  font-weight: 400;
  width: 80%;
  border-bottom: none;
`

export const SubTitle = styled.h3`
  font-size: 23px;
  line-height: 27px;
`
export const Headline = styled.p`
  position: relative;
  color: ${variables.colorEconomyDark};
  font-size: 23px;
  line-height: 26px;
  margin-bottom: 60px;
  @media screen and (min-width: 1200px) {
    padding-left: 40px;
  }

  &::before,
  &::after {
    position: absolute;
    font-size: 6rem;
    line-height: 1;
    font-family: "Arial", sans-serif;
    visibility: hidden;

    @media screen and (min-width: 1200px) {
      visibility: visible;
    }
  }

  &::before {
    top: -1rem;
    transform: translateX(-100%);
    content: "\\201C";
    @media screen and (min-width: 1200px) {
      visibility: visible;
      left: 2rem;
    }
  }

  &::after {
    bottom: -5rem;
    right: 0rem;
    content: "\\201D";
  }
`

export const PageIntro = styled.div`
  display: grid;
  grid-template-areas: "text . bubble";
  grid-template-columns: 65% 5% 30%;
  p {
    line-height: 18px;
  }
`

export const ItemWrapper = styled.div`
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

export const ProductIcon = styled.span`
  width: 20px;
  height: 20px;
  display: inline-flex;
  color: #fff;
  justify-content: center;
  font-family: "Zurich", sans-serif;
  font-weight: 500;
  line-height: 20px;
  align-content: center;
  margin-right: 5px;
`

export const ForecastProductIcon = styled(ProductIcon)`
  background-color: ${variables.colorForecast};
  &::before {
    content: "f";
  }
`

export const ProfileProductIcon = styled(ProductIcon)`
  background-color: ${variables.colorProfile};
  &::before {
    content: "P";
  }
`

export const CrossLink = styled.div`
  a {
    color: ${variables.linkColor};
  }
`

export const Note = styled.div`
  background: #f2f2f2;
  border: 0;
  padding: 20px 40px;
  line-height: 20px;
  margin: 30px 0;
`
export const AnalysisContainer = styled.div`
  h3 {
    color: ${variables.colorEconomyDark};
    margin-bottom: 8px;
    border-bottom: 1px solid #999;
    font-size: 23px;
  }
`

export const Highlight = styled.p`
  color: ${variables.colorEconomyDark};
`

export const SourceBubble = styled.div`
  grid-area: bubble;
  div {
    h3 {
      color: ${variables.colorEconomyDark};
    }
    padding: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  }
`

export const RelatedPagesCTA = styled.div`
  display: grid;
  grid-template-areas: "text . links";
  grid-template-columns: 65% 5% 30%;
  padding: 20px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  h3 {
    color: ${variables.colorEconomyDark};
    margin-bottom: 0;
    &::after {
      font-family: "id-icons";
      font-size: 28px;
      line-height: 0;
      content: "\\E603";
      float: right;
      margin-top: 15px;
    }
  }
  ul {
    list-style: none;
    grid-area: links;
    margin-bottom: 0;
    a {
      color: ${variables.gray};
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`
