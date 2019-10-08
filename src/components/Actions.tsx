import React, { useState } from "react"
import styled from "styled-components"
import { RenderContext } from "../../lib/word-renderer/word-render"
const variables = require(`sass-extract-loader?{"plugins": ["sass-extract-js"]}!../styles/variables.scss`)

export const ExportDropdown: React.FC<IExportDropdownProps> = props => {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const { exportOptions, handleExport } = props

  return (
    <DropdownContainer>
      <ExportButton
        onClick={() => {
          if (!dropdownVisible) {
            function dismiss(this: Document, ev: MouseEvent) {
              setDropdownVisible(false)
              document.removeEventListener("click", dismiss)
            }
            document.addEventListener("click", dismiss)
          }
          setDropdownVisible(!dropdownVisible)
        }}
      />
      <DropdownList dropdownVisible={dropdownVisible}>
        {exportOptions.formats.map((item: IFormat, i: number) => {
          return (
            <DropdownListItem
              key={i}
              onClick={() => {
                handleExport(item)
              }}
            >
              {item.displayText}
            </DropdownListItem>
          )
        })}
      </DropdownList>
    </DropdownContainer>
  )
}

const LogoBox = styled.span`
  width: 20px;
  height: 20px;
  display: inline-flex;
  justify-content: center;
`

const TwitterLogo = () => (
  <LogoBox>
    <svg width="17" height="18" viewBox="0 0 17 14">
      <path d="M16.272 4.098c-0.442 0.643-0.994 1.215-1.627 1.677 0.010 0.141 0.010 0.281 0.010 0.422 0 4.289-3.265 9.231-9.231 9.231-1.838 0-3.546-0.532-4.982-1.456 0.261 0.030 0.512 0.040 0.783 0.040 1.517 0 2.913-0.512 4.028-1.386-1.426-0.030-2.622-0.964-3.033-2.25 0.201 0.030 0.402 0.050 0.613 0.050 0.291 0 0.583-0.040 0.854-0.11-1.487-0.301-2.602-1.607-2.602-3.184v-0.040c0.432 0.241 0.934 0.392 1.467 0.412-0.874-0.583-1.446-1.577-1.446-2.702 0-0.603 0.161-1.155 0.442-1.637 1.597 1.969 3.998 3.254 6.69 3.395-0.050-0.241-0.080-0.492-0.080-0.743 0-1.788 1.446-3.244 3.244-3.244 0.934 0 1.778 0.392 2.371 1.025 0.733-0.141 1.436-0.412 2.059-0.783-0.241 0.753-0.753 1.386-1.426 1.788 0.653-0.070 1.286-0.251 1.868-0.502z" />
    </svg>
  </LogoBox>
)

const FacebookLogo = () => (
  <LogoBox>
    <svg width="15" height="18" viewBox="0 0 15 18">
      <path d="M14.575 1.286c0.472 0 0.854 0.382 0.854 0.854v13.721c0 0.472-0.382 0.854-0.854 0.854h-3.927v-5.977h1.999l0.301-2.33h-2.3v-1.487c0-0.673 0.181-1.125 1.155-1.125l1.225-0.010v-2.079c-0.211-0.030-0.944-0.090-1.788-0.090-1.778 0-3.003 1.085-3.003 3.074v1.718h-2.009v2.33h2.009v5.977h-7.383c-0.472 0-0.854-0.382-0.854-0.854v-13.721c0-0.472 0.382-0.854 0.854-0.854h13.721z" />
    </svg>
  </LogoBox>
)

const LinkedInLogo = () => (
  <LogoBox>
    <svg width="15" height="18" viewBox="0 0 15 18">
      <path d="M3.506 6.278v9.954h-3.315v-9.954h3.315zM3.717 3.204c0.010 0.954-0.713 1.718-1.868 1.718v0h-0.020c-1.115 0-1.828-0.763-1.828-1.718 0-0.974 0.743-1.718 1.868-1.718 1.135 0 1.838 0.743 1.848 1.718zM15.429 10.527v5.705h-3.305v-5.324c0-1.336-0.482-2.25-1.677-2.25-0.914 0-1.456 0.613-1.698 1.205-0.080 0.221-0.11 0.512-0.11 0.814v5.555h-3.305c0.040-9.020 0-9.954 0-9.954h3.305v1.446h-0.020c0.432-0.683 1.215-1.677 3.003-1.677 2.18 0 3.807 1.426 3.807 4.48z" />
    </svg>
  </LogoBox>
)

const EmailLogo = () => (
  <LogoBox>
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path
        fill="#000"
        d="M1.667 5.833v11.667h16.667v-11.667zM10 12.275l-6.142-4.775h12.283zM6.55 11.667l-3.217 3.067v-5.567zM7.883 12.7l2.125 1.667 2.042-1.592 3.208 3.058h-10.658zM13.383 11.725l3.283-2.558v5.667z"
      />
    </svg>
  </LogoBox>
)

export const Share = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false)

  return (
    <DropdownContainer style={{ marginRight: "20px" }}>
      <ShareButton
        onClick={() => {
          if (!dropdownVisible) {
            function dismiss(this: Document, ev: MouseEvent) {
              setDropdownVisible(false)
              document.removeEventListener("click", dismiss)
            }
            document.addEventListener("click", dismiss)
          }
          setDropdownVisible(!dropdownVisible)
        }}
      />
      <ShareDropdownList dropdownVisible={dropdownVisible}>
        <ShareDropdownListItem>
          <a className="addthis_button_twitter" target="_blank">
            <TwitterLogo />
            <PageButtonName>Twitter</PageButtonName>
          </a>
        </ShareDropdownListItem>

        <ShareDropdownListItem>
          <a className="addthis_button_facebook" target="_blank">
            <FacebookLogo />
            <PageButtonName>Facebook</PageButtonName>
          </a>
        </ShareDropdownListItem>
        <ShareDropdownListItem>
          <a className="addthis_button_linkedin" target="_blank">
            <LinkedInLogo />
            <PageButtonName>LinkedIn</PageButtonName>
          </a>
        </ShareDropdownListItem>
        <ShareDropdownListItem>
          <a className="addthis_button_email" target="_blank">
            <EmailLogo />
            <PageButtonName>Email</PageButtonName>
          </a>
        </ShareDropdownListItem>
      </ShareDropdownList>
    </DropdownContainer>
  )
}

export const ExportPage = ({ onExport, exportOptions }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false)

  return (
    <DropdownContainer>
      <ExportPageButton
        onClick={() => {
          if (!dropdownVisible) {
            function dismiss(this: Document, ev: MouseEvent) {
              setDropdownVisible(false)
              document.removeEventListener("click", dismiss)
            }
            document.addEventListener("click", dismiss)
          }
          setDropdownVisible(!dropdownVisible)
        }}
      />
      <ShareDropdownList dropdownVisible={dropdownVisible}>
        {exportOptions.formats.map((item: IFormat, i: number) => (
          <ShareDropdownListItem
            key={i}
            onClick={() => {
              onExport(item)
            }}
          >
            {item.displayText}
          </ShareDropdownListItem>
        ))}
      </ShareDropdownList>
    </DropdownContainer>
  )
}

const PageButtonName = styled.span`
  margin-left: 5px;
  line-height: 25px;
`

const ShareButton = ({ onClick }) => (
  <PageShareButtonLink onClick={onClick}>
    <PageButtonName>Share</PageButtonName>
  </PageShareButtonLink>
)
const ExportPageButton = ({ onClick }) => (
  <PageExportButtonLink onClick={onClick}>
    <PageButtonName>Export</PageButtonName>
  </PageExportButtonLink>
)

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
`

const DropdownListItem = styled.li`
  padding: 0 10px;

  &:hover {
    cursor: pointer;
    background-color: ${variables.grayLightest};
  }
`

const DropdownList = styled.ul`
  visibility: ${props => (props.dropdownVisible ? "visible" : "hidden")};
  z-index: 100;
  position: absolute;
  right: 0;
  top: 25px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100px;
  list-style-type: none;
  margin: 5px auto auto 0;
`
const ShareDropdownList = styled(DropdownList)`
  width: 110px;
`

const ShareDropdownListItem = styled(DropdownListItem)`
  a {
    text-decoration: none;
    color: ${variables.linkColor};
    display: block;
  }
`

const ButtonLink = styled.a`
  width: fit-content;
  display: inline-flex;
  bottom: 5px;
  right: 10px;
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

const ExportIcon = styled(IconBase)`
  &::before {
    content: "\\E61A";
  }
`

const PageButtonLink = styled(ButtonLink)`
  background-color: unset;
`

const PageShareButtonLink = styled.div`
  cursor: pointer;
  &::before {
    vertical-align: middle;
    font-size: 20px;
    font-family: "id-icons";
    content: "\\e901";
  }
`
const PageExportButtonLink = styled.div`
  cursor: pointer;
  &::before {
    vertical-align: middle;
    font-size: 20px;
    font-family: "id-icons";
    content: "\\E61A";
  }
`

const ExportButtonLink = styled(ButtonLink)`
  background-color: unset;
`

const Button = ({ name, action, children }) => (
  <React.Fragment>
    <ButtonLink onClick={action}>
      <span>{name}</span>
      {children}
    </ButtonLink>
  </React.Fragment>
)

const ExportButton = ({ onClick }) => (
  <Button name="export" action={onClick}>
    <ExportIcon />
  </Button>
)

export const ResetButton = ({ onReset }) => (
  <Button name="reset" action={onReset}>
    <ResetIcon />
  </Button>
)

const _Actions = styled.div`
  position: absolute;
  display: flex;
  top: 14px;
  right: 12px;
  z-index: 100;
`

export class Actions extends React.Component {
  public render = () => {
    return (
      <RenderContext.Consumer>
        {renderContext =>
          renderContext === "word" ? (
            <React.Fragment />
          ) : (
            <_Actions>{this.props.children}</_Actions>
          )
        }
      </RenderContext.Consumer>
    )
  }
}

export const EntityContainer = styled.div`
  position: relative;
`
