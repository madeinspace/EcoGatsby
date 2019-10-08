import * as React from "react"
import SelectDropdown from "./SelectDropdown"
import styled from "styled-components"
import Sticky from "@wicked_query/react-sticky"
const variables = require(`sass-extract-loader?{"plugins": ["sass-extract-js"]}!../../styles/variables.scss`)

const _ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  background: #595959;
  color: white;
  padding: 15px;
  position: relative;
  z-index: 2;
  margin-bottom: 30px;
`

const ButtonLink = styled.a`
  color: ${variables.grayDark};
  width: fit-content;
  display: inline-flex;
  margin-top: 23px;
  padding: 0 0 0 5px;
  border: none;
  line-height: 25px;
  height: 25px;
  cursor: pointer;
  background-color: #dddddd;
`
const IconBase = styled.span`
  line-height: 25px;
  height: 25px;
  width: 24px;
  margin-left: 5px;
  color: #fff;
  background-color: ${variables.colorEconomy};
  font-family: "id-icons";
  padding-left: 4px;
`
const ResetIcon = styled(IconBase)`
  &::before {
    content: "\\E907";
  }
`

interface Selectable {
  ID: number
  Name: string
}

interface Dropdown {
  items: Selectable[]
  title: string
  handleChange?: (e: any) => void
  value: number
}

interface IControlPanelProps {
  dropdowns: Dropdown[]
  onReset: () => void
}

const Button = ({ name, action, children }) => (
  <React.Fragment>
    <ButtonLink onClick={action}>
      <span>{name}</span>
      {children}
    </ButtonLink>
  </React.Fragment>
)

export const ResetButton = ({ onReset }) => (
  <Button name="reset" action={onReset}>
    <ResetIcon />
  </Button>
)

const ControlPanel: React.SFC<IControlPanelProps> = ({
  dropdowns,
  onReset,
}) => {
  return (
    <Sticky>
      <_ControlPanel>
        {dropdowns.map((dd: any, i) => {
          return (
            <SelectDropdown
              key={i}
              value={dd.value}
              list={dd.items || []}
              title={dd.title}
              handleChange={dd.handleChange}
            />
          )
        })}
        <ResetButton onReset={onReset} />
      </_ControlPanel>
    </Sticky>
  )
}

export default ControlPanel
