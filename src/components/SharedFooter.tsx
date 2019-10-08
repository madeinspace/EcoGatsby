import React from "react"
import styled from "styled-components"
import { BaseFooterRow } from "./grid"
const variables = require(`sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/variables.scss`)

const StaticFooter = styled(BaseFooterRow)`
  margin-top: 2em;
  margin-bottom: 2em;
  grid-template-areas: ". powered-by powered-by powered-by demographic demographic demographic .";
  grid-gap: 0;
`
const DisclaimerFooter = styled(StaticFooter)`
  margin-top: 40px;
  margin-bottom: 40px;
  grid-template-areas: ". disclaimer disclaimer disclaimer disclaimer disclaimer disclaimer .";
`

const DisclaimerText = styled.div`
  grid-area: disclaimer;

  p {
    color: #6a6a6a;
    font-size: 8.5px;
    line-height: 11px;
    margin: 0;
  }
`

const PoweredBy = styled.div`
  grid-area: powered-by;
  display: flex;
  justify-contents: space-between;
`

const Demographic = styled.div`
  grid-area: demographic;
  display: flex;
  justify-contents: space-between;
`

const LogoBox = styled.span`
  width: 30%;
`
const LogoCompanion = styled.span`
  width: 70%;
`

const StaticFooterHeading = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 22px;
  color: #000;
`

const StaticFooterText = styled.p`
  font-size: 16px;
  margin-bottom: 16px;
  line-height: 24px;
  color: #56565a;
`

const ArrowIcon = styled.span`
  &::after {
    font-family: "id-icons";
    content: "\\E603";
  }
`

const ExternalLink = styled.a`
  text-decoration: none;
  color: black;

  &.active,
  :hover {
    text-decoration: underline;
  }
`

const HomeLink = styled.a`
  text-decoration: none;
  color: ${variables.colorId};

  &.active,
  :hover {
    text-decoration: underline;
  }
`

export const SharedFooter = () => (
  <React.Fragment>
    <StaticFooter>
      <PoweredBy>
        <LogoBox>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
            <path d="M29.37,78.24h-12V36.85h12Zm-12-59.36h12V29.35h-12Z" />
            <path d="M54,71.07c5.28,0,8.82-4.86,8.82-13.44S59.3,44.11,54,44.11s-8.41,4.78-8.41,13.52S48.83,71.07,54,71.07m8.74,1.24a14.28,14.28,0,0,1-12.45,6.76c-9.73,0-16.9-8.16-16.9-21.52s6.93-21.44,16.74-21.44c5.44,0,9.48,2.06,12.45,6.43V18.88h12v51A55.93,55.93,0,0,0,75,78.24H63.17Z" />
            <path
              d="M7.61,78.77a6.1,6.1,0,1,0-6.09-6.09,6.09,6.09,0,0,0,6.09,6.09"
              style={{ fill: "#ff4612" }}
            />
            <path
              d="M4.38,11.77c1.12,0,1.55-1.05,1.55-3.21S5.6,5.26,4.28,5.26,2.66,6.34,2.66,8.63c0,2.1.5,3.14,1.72,3.14M1.23,5.89A10.46,10.46,0,0,0,1.16,4.4H2.63l.08.8a2.34,2.34,0,0,1,2-1c1.94,0,2.74,1.42,2.74,4.29,0,3-.84,4.51-2.74,4.51a2.26,2.26,0,0,1-2-1.15V16H1.23Z"
              style={{ fill: "#ff4612" }}
            />
            <path
              d="M10.35,8.6c0,2.17.4,3.17,1.67,3.17s1.67-1,1.67-3.16S13.29,5.44,12,5.44s-1.67,1-1.67,3.16M12,4.22c2.27,0,3.14,1.39,3.14,4.38S14.29,13,12,13,8.86,11.6,8.86,8.58,9.77,4.22,12,4.22"
              style={{ fill: "#ff4612" }}
            />
            <path
              d="M16.07,4.4h1.49l1.14,4.83a23,23,0,0,1,.45,2.35c.3-1.27.47-2.05.55-2.35L21,4.4h1.72l1.32,4.93c.07.23.22,1,.48,2.25.08-.6.25-1.37.48-2.32L26.24,4.4h1.47l-2.22,8.39h-1.8L22.3,7.41c-.05-.18-.2-.87-.43-2.07-.18,1-.33,1.69-.43,2.07L20,12.79H18.24Z"
              style={{ fill: "#ff4612" }}
            />
            <path
              d="M33.36,7.84V7.13c0-1.27-.53-1.92-1.54-1.92-1.15,0-1.67.85-1.71,2.64ZM31.78,13c-2.36,0-3.14-1.42-3.14-4.46s.9-4.31,3.14-4.31,3,1.1,3,3.41v1.3H30.12v.48c0,1.6.47,2.36,1.65,2.36.87,0,1.44-.57,1.57-1.6h1.44a2.76,2.76,0,0,1-3,2.82"
              style={{ fill: "#ff4612" }}
            />
            <path
              d="M37.81,5.49a2,2,0,0,1,2.11-1.3l.27,0V5.67l-.37,0c-1.47,0-2,.6-2,2.05v5.08H36.37v-7c0-.12-.05-.59-.13-1.42h1.44Z"
              style={{ fill: "#ff4612" }}
            />
            <path
              d="M45.73,7.84V7.13c0-1.27-.54-1.92-1.54-1.92-1.15,0-1.67.85-1.7,2.64ZM44.14,13C41.79,13,41,11.57,41,8.53s.9-4.31,3.14-4.31,3,1.1,3,3.41v1.3H42.49v.48c0,1.6.47,2.36,1.65,2.36.87,0,1.44-.57,1.57-1.6h1.44a2.76,2.76,0,0,1-3,2.82"
              style={{ fill: "#ff4612" }}
            />
            <path
              d="M50,8.56c0,2.29.35,3.34,1.67,3.34,1.17,0,1.6-1.07,1.6-3.29s-.44-3.21-1.69-3.21c-1.09,0-1.59,1-1.59,3.16M53.25.76H54.7V11.29a10.46,10.46,0,0,0,.07,1.49H53.35L53.27,12a2.36,2.36,0,0,1-2,1c-1.94,0-2.76-1.4-2.76-4.28,0-3,.84-4.51,2.74-4.51a2.24,2.24,0,0,1,2,1.14Z"
              style={{ fill: "#ff4612" }}
            />
            <path
              d="M62,8.53c0,2.29.43,3.38,1.62,3.38s1.65-1,1.65-3.29-.45-3.21-1.57-3.21S62,6.42,62,8.53m-1.44,2.76V.76H62V5.32a2.24,2.24,0,0,1,2-1.14c1.91,0,2.74,1.49,2.74,4.51S65.9,13,63.95,13A2.07,2.07,0,0,1,62,12l-.18.77H60.47a10.43,10.43,0,0,0,.08-1.5"
              style={{ fill: "#ff4612" }}
            />
            <polygon
              points="69.61 15.96 70.53 12.79 67.66 4.4 69.35 4.4 71.35 11.04 73.34 4.4 74.89 4.4 71.03 15.96 69.61 15.96"
              style={{ fill: "#ff4612" }}
            />
            <path
              d="M83,40.62h1.7v1.06H83V46.8c0,.93.26,1.21,1,1.21.22,0,.46,0,.71,0v1.11a5.73,5.73,0,0,1-1.21.15c-1.5,0-2-.56-2-1.92V41.67H80.21V40.62H81.5V38.9L83,38.2Z"
              style={{ fill: "#757575" }}
            />
            <path
              d="M90.44,43.7c0-1.46-.26-2.16-1.41-2.16s-1.67.9-1.67,2.69v4.94H85.89V36.91h1.46v4.7a2.63,2.63,0,0,1,2.28-1.19,2.12,2.12,0,0,1,2.28,2.3v6.45H90.44Z"
              style={{ fill: "#757575" }}
            />
            <path
              d="M98.39,44.12v-.73c0-1.29-.54-2-1.57-2-1.17,0-1.7.87-1.73,2.69Zm-1.62,5.24c-2.4,0-3.2-1.45-3.2-4.54s.92-4.39,3.2-4.39,3.06,1.12,3.06,3.47v1.33H95.09v.49c0,1.63.48,2.4,1.68,2.4.89,0,1.47-.58,1.6-1.63h1.46a2.81,2.81,0,0,1-3.06,2.88"
              style={{ fill: "#757575" }}
            />
            <path
              d="M84.24,62.22c1.14,0,1.58-1.07,1.58-3.27s-.34-3.37-1.69-3.37S82.49,56.69,82.49,59c0,2.14.51,3.2,1.75,3.2m-3.22-6A10.56,10.56,0,0,0,81,54.72h1.5l.08.82a2.38,2.38,0,0,1,2-1c2,0,2.79,1.45,2.79,4.37,0,3.08-.85,4.6-2.79,4.6a2.3,2.3,0,0,1-2-1.18v4.2H81Z"
              style={{ fill: "#757575" }}
            />
            <path
              d="M90.32,59c0,2.21.41,3.24,1.7,3.24s1.7-1,1.7-3.22-.41-3.23-1.7-3.23-1.7,1-1.7,3.21M92,54.53c2.31,0,3.2,1.41,3.2,4.46s-.89,4.48-3.2,4.48S88.8,62.05,88.8,59s.92-4.44,3.22-4.44"
              style={{ fill: "#757575" }}
            />
            <path
              d="M100.12,62.22c1.14,0,1.58-1.07,1.58-3.27s-.34-3.37-1.69-3.37S98.37,56.69,98.37,59c0,2.14.51,3.2,1.75,3.2m-3.22-6a10.71,10.71,0,0,0-.07-1.51h1.5l.08.82a2.38,2.38,0,0,1,2-1c2,0,2.79,1.45,2.79,4.37,0,3.08-.85,4.6-2.79,4.6a2.3,2.3,0,0,1-2-1.18v4.2H96.91Z"
              style={{ fill: "#757575" }}
            />
            <path
              d="M106.32,60.16c0,1.47.26,2.16,1.41,2.16s1.67-.89,1.67-2.67V54.72h1.46v7.2a13.12,13.12,0,0,0,.08,1.34h-1.5l-.07-1a2.61,2.61,0,0,1-2.26,1.21,2.12,2.12,0,0,1-2.28-2.3V54.72h1.48Z"
              style={{ fill: "#757575" }}
            />
            <rect
              x="112.76"
              y="51.01"
              width="1.46"
              height="12.25"
              style={{ fill: "#757575" }}
            />
            <path
              d="M117.25,60.59a1.37,1.37,0,0,0,1.34,1.46c1.11,0,1.82-.87,1.82-2.6v-.67c-2.21,0-3.16.41-3.16,1.8M116,56.95v-.17c0-1.48,1-2.26,3-2.26s2.88.78,2.88,2.48v4a16.64,16.64,0,0,0,.15,2.28h-1.46l-.1-1.07a2.8,2.8,0,0,1-2.21,1.16,2.42,2.42,0,0,1-2.45-2.62c0-2,1.28-3,3.79-3h.82v-.42c0-1.22-.26-1.77-1.31-1.77s-1.56.44-1.56,1.29v.09Z"
              style={{ fill: "#757575" }}
            />
            <path
              d="M125.68,54.72h1.7v1.06h-1.7V60.9c0,.94.26,1.21,1,1.21.22,0,.46,0,.72,0v1.11a5.74,5.74,0,0,1-1.21.15c-1.5,0-2-.56-2-1.92V55.77h-1.29V54.72h1.29V53l1.46-.7Z"
              style={{ fill: "#757575" }}
            />
            <path
              d="M128.72,54.72h1.41v8.54h-1.41Zm0-3.71h1.41v1.56h-1.41Z"
              style={{ fill: "#757575" }}
            />
            <path
              d="M133.46,59c0,2.21.41,3.24,1.7,3.24s1.7-1,1.7-3.22-.41-3.23-1.7-3.23-1.7,1-1.7,3.21m1.7-4.46c2.32,0,3.2,1.41,3.2,4.46s-.89,4.48-3.2,4.48-3.22-1.41-3.22-4.49.92-4.44,3.22-4.44"
              style={{ fill: "#757575" }}
            />
            <path
              d="M144.61,57.8c0-1.46-.25-2.16-1.41-2.16s-1.67.9-1.67,2.69v4.94h-1.46v-7.2a13.15,13.15,0,0,0-.09-1.35h1.5l.07,1a2.59,2.59,0,0,1,2.26-1.19,2.12,2.12,0,0,1,2.28,2.3v6.45h-1.48Z"
              style={{ fill: "#757575" }}
            />
            <path
              d="M85.65,73.26v-.73c0-1.29-.55-2-1.57-2-1.18,0-1.7.87-1.74,2.69ZM84,78.5c-2.4,0-3.2-1.45-3.2-4.54s.92-4.39,3.2-4.39S87.1,70.69,87.1,73v1.33H82.35v.49c0,1.63.48,2.4,1.68,2.4.89,0,1.47-.58,1.6-1.63H87.1A2.81,2.81,0,0,1,84,78.5"
              style={{ fill: "#757575" }}
            />
            <polygon
              points="87.87 78.29 90.59 73.73 88.12 69.75 89.81 69.75 91.54 72.76 93.33 69.75 94.93 69.75 92.34 73.8 95.25 78.29 93.54 78.29 91.42 74.77 89.48 78.29 87.87 78.29"
              style={{ fill: "#757575" }}
            />
            <path
              d="M99.53,77.26c1.14,0,1.58-1.07,1.58-3.27s-.34-3.37-1.68-3.37-1.65,1.1-1.65,3.44c0,2.14.51,3.2,1.75,3.2m-3.22-6a10.54,10.54,0,0,0-.07-1.51h1.5l.09.82a2.38,2.38,0,0,1,2-1c2,0,2.79,1.45,2.79,4.37,0,3.08-.85,4.59-2.79,4.59a2.3,2.3,0,0,1-2-1.17v4.2H96.31Z"
              style={{ fill: "#757575" }}
            />
            <path
              d="M108.92,73.26v-.73c0-1.29-.54-2-1.57-2-1.17,0-1.7.87-1.74,2.69Zm-1.62,5.24c-2.4,0-3.2-1.45-3.2-4.54s.92-4.39,3.2-4.39,3.06,1.12,3.06,3.47v1.33h-4.75v.49c0,1.63.48,2.4,1.68,2.4.89,0,1.46-.58,1.6-1.63h1.46a2.81,2.81,0,0,1-3.06,2.88"
              style={{ fill: "#757575" }}
            />
            <path
              d="M113.45,70.86a2.07,2.07,0,0,1,2.14-1.33l.27,0V71l-.38,0c-1.5,0-2,.61-2,2.09v5.17H112V71.18c0-.12-.05-.6-.14-1.45h1.47Z"
              style={{ fill: "#757575" }}
            />
            <path
              d="M118.83,69.75h1.7v1.05h-1.7v5.12c0,.94.25,1.21,1,1.21.22,0,.46,0,.71,0v1.11a5.62,5.62,0,0,1-1.21.15c-1.5,0-2-.56-2-1.92V70.81h-1.29V69.75h1.29V68l1.46-.7Z"
              style={{ fill: "#757575" }}
            />
            <path
              d="M123,75.69c0,1.06.53,1.6,1.45,1.6s1.4-.46,1.4-1.14c0-.53-.39-.92-1.24-1.36l-1.55-.8c-1.06-.54-1.53-1.07-1.53-2,0-1.45,1.16-2.45,3-2.45s2.81.89,2.81,2.28V72h-1.56a1.25,1.25,0,0,0-1.38-1.34,1.14,1.14,0,0,0-1.29,1.07c0,.46.29.75.87,1l1.41.7c1.43.71,2.09,1.29,2.09,2.47,0,1.57-1.18,2.6-3,2.6s-3-1-3-2.81Z"
              style={{ fill: "#757575" }}
            />
          </svg>
        </LogoBox>
        <LogoCompanion
          style={{
            paddingRight: "20px",
            borderRight: "1px solid #ccc",
          }}
        >
          <StaticFooterHeading>
            Powered by .id - the population experts for Hobsons Bay City
          </StaticFooterHeading>
          <StaticFooterText>
            .id community is an evidence-base for over 250 local government
            areas in Australia and New Zealand, helping you make informed
            decisions.
          </StaticFooterText>
          <HomeLink target="_blank" href="http://home.id.com.au">
            LEARN MORE ABOUT .id <ArrowIcon />
          </HomeLink>
        </LogoCompanion>
      </PoweredBy>
      <Demographic>
        <LogoBox>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
            <polygon
              points="129.81 20.04 127.81 20.04 127.81 89.65 87.79 89.65 88.36 93.98 72.37 93.98 72.94 89.65 32.35 89.65 32.35 20.04 30.35 20.04 30.35 91.65 70.66 91.65 70.08 95.98 90.64 95.98 90.07 91.65 129.81 91.65 129.81 20.04"
              style={{ fill: "#ff4611" }}
            />
            <polygon
              points="61 58.59 61 69.18 63 69.18 63 57.6 53.29 50.12 43.78 57.39 43.78 69.18 45.78 69.18 45.78 58.38 53.28 52.64 61 58.59"
              style={{ fill: "#ff4611" }}
            />
            <path
              d="M69.21,61.5v7.37h2V61.5c1.67-.29,3.3-1.45,3.3-4.83,0-3.73-1.89-6.66-4.3-6.66s-4.3,2.92-4.3,6.66C65.91,60.06,67.53,61.21,69.21,61.5Zm1-9.49c1.08,0,2.3,2,2.3,4.66s-1.13,2.92-2.3,2.92-2.3-.23-2.3-2.92S69.12,52,70.21,52Z"
              style={{ fill: "#ff4611" }}
            />
            <rect
              x="52.39"
              y="63.54"
              width="2"
              height="5.33"
              style={{ fill: "#ff4611" }}
            />
            <circle cx="59.14" cy="19.04" r="4.8" style={{ fill: "#ff4611" }} />
            <path
              d="M80.15,86.32a105.33,105.33,0,0,1,21.3-2,131,131,0,0,1,23.31,2V14.09a122,122,0,0,0-14.63-1.75v-6L99.81,9.9v2.19q-2,0-4,.12V6.85H85.46v6.32c-1.77.26-3.54.55-5.32.92-2.23-.46-4.46-.81-6.68-1.1a15.51,15.51,0,0,0-28.57-.21c-5.74.58-9.36,1.31-9.36,1.31V86.32a131,131,0,0,1,23.31-2A105.31,105.31,0,0,1,80.15,86.32ZM99.81,14.08v5.77h-4V14.21Q97.76,14.11,99.81,14.08ZM87.46,29.85v-21h6.3v13h8V11.33l6.32-2.17V21.61h9v8.24h2V19.61h-9V14.35c5.8.38,10.35,1,12.63,1.42V83.94a138.68,138.68,0,0,0-21.31-1.65,108.35,108.35,0,0,0-20.37,1.81V16c1.43-.29,2.89-.54,4.39-.76V29.85ZM59.14,5.42A13.51,13.51,0,0,1,70.48,26.28L59.14,43.75,47.8,26.27A13.51,13.51,0,0,1,59.14,5.42ZM37.54,15.77c1.42-.23,3.72-.58,6.65-.9a15.38,15.38,0,0,0,1.94,12.49l13,20.06,13-20.06a15.36,15.36,0,0,0,2-12.27c1.68.24,3.32.51,4.92.83V84.08Q74.72,83.25,70,82.8c-.13-8.86-8.14-8.87-12.94-8.87a2.39,2.39,0,0,1-2.66-2.41h-2A4.42,4.42,0,0,0,57,75.93c5.87,0,10.74.53,10.94,6.71q-4.43-.33-9.13-.34a138.69,138.69,0,0,0-21.31,1.65Z"
              style={{ fill: "#ff4611" }}
            />
            <path
              d="M109.3,55.5a4.48,4.48,0,0,0-1,8.85v12h2v-12a4.47,4.47,0,0,0-1-8.82Zm0,7A2.48,2.48,0,1,1,111.78,60,2.48,2.48,0,0,1,109.3,62.46Z"
              style={{ fill: "#ff4611" }}
            />
            <path
              d="M96.14,58.54a4.52,4.52,0,0,0-1,8.93v9.1h2V67.46a4.52,4.52,0,0,0-1-8.92Zm0,7a2.52,2.52,0,1,1,2.52-2.52A2.53,2.53,0,0,1,96.14,65.58Z"
              style={{ fill: "#ff4611" }}
            />
            <path
              d="M92,51.24h2v-3h3v3h2v-3H109.7v3h2v-3H115V42.4l-3.57-4.81h-4.39v-3H87.8V48.21H92Zm18.46-11.65L113,43.06v3.15h-6V39.58Zm-20.64-3h15.26v9.61H89.8Z"
              style={{ fill: "#ff4611" }}
            />
          </svg>
        </LogoBox>
        <LogoCompanion>
          <StaticFooterHeading>Free demographic resources</StaticFooterHeading>
          <StaticFooterText>
            Access hundreds of free demographic and economic resources to help
            you make informed decisions.
          </StaticFooterText>
          <HomeLink
            target="_blank"
            href="http://home.id.com.au/demographic-resources/"
          >
            FIND FREE RESOURCES
            <ArrowIcon />
          </HomeLink>
        </LogoCompanion>
      </Demographic>
    </StaticFooter>
    <hr />
    <DisclaimerFooter>
      <DisclaimerText>
        <p>
          DISCLAIMER: While all due care has been taken to ensure that the
          content of this website is accurate and current, there may be errors
          or omissions in it and no legal responsibility is accepted for the
          information and opinions in this website.
        </p>
        <p>
          Please view our{" "}
          <ExternalLink href="https://home.id.com.au/privacy-policy/">
            Privacy Policy
          </ExternalLink>
          ,{" "}
          <ExternalLink href="https://home.id.com.au/terms-of-use/">
            Terms of use
          </ExternalLink>{" "}
          and{" "}
          <ExternalLink href="https://home.id.com.au/legal-notices/">
            Legal notices
          </ExternalLink>
          .
        </p>
        <p>
          ABS Data and the copyright in the ABS Data remains the property of the
          Australian Bureau of Statistics. The copyright in the way .id has
          modified, transformed or reconfigured the ABS Data as published on
          this website remains the property of .id. ABS Data can be accessed
          from the Australian Bureau of Statistics at{" "}
          <ExternalLink
            href="http://www.abs.gov.au"
            title="Australian Bureau of Statistics"
          >
            www.abs.gov.au
          </ExternalLink>
          . ABS data can be used under license - terms published on ABS website.{" "}
          <ExternalLink href="mailto:intermediary.management@abs.gov.au">
            intermediary.management@abs.gov.au
          </ExternalLink>{" "}
          if you have any queries or wish to distribute any ABS data.
        </p>{" "}
      </DisclaimerText>
    </DisclaimerFooter>
  </React.Fragment>
)
export default SharedFooter
