import React, { useState } from "react"
import styled from "styled-components"
const variables = require(`sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/variables.scss`)

const _InfoBox = styled.div`
  display: ${props => (props.visible ? "flex" : "none")};
  margin: 10px 0;
  align-items: center;
  color: ${variables.grayMediumdark};
  background: ${variables.grayLightest};
  &::before {
    padding: 8px;
    content: "\\e62c";
    font-family: "id-icons";
    color: ${variables.colorInfoBox};
    border-left: 3px solid ${variables.colorInfoBox};
    font-size: 24px;
  }
`

const CloseButton = styled.button`
  margin-left: auto;
  padding-right: 15px;
  border: none;
  background-color: transparent;
  font-size: 20px;
  font-weight: 700;
  line-height: 18px;
  color: #000;
  opacity: 0.2;
  cursor: pointer;
  &::hover {
    opacity: 0.7;
  }
`

const InfoBox = ({ children }) => {
  const [visible, setVisible] = useState(true)
  return (
    <_InfoBox visible={visible}>
      {children}
      <CloseButton
        onClick={() => {
          setVisible(!visible)
        }}
      >
        ×
      </CloseButton>
    </_InfoBox>
  )
}

export default InfoBox
