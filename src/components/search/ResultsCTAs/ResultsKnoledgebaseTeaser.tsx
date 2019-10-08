import * as React from "react"
import styled from "styled-components"

const KnowledgeBaseCTALink = styled.h2`
  font-size: 24px;
  a {
    color: #333;
    text-decoration: none;
    span {
      color: #ff4612;
    }
  }
`

export function KnowledgeBaseCTA() {
  return (
    <KnowledgeBaseCTALink>
      <a
        target="_BLANK"
        href="https://answers.id.com.au/answers/why-cant-i-see-data-for-my-area"
      >
        Can’t find the place you’re looking for? <span>Learn why.</span>
      </a>
    </KnowledgeBaseCTALink>
  )
}
