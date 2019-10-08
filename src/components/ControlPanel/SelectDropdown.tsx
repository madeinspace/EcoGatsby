import React from "react"
import styled from "styled-components"

const _SelectDropdown = styled.div`
  h5 {
    margin: 0 0 6px 0;
  }
`

const _Select = styled.select`
  height: 25px;
  border: none;
  padding-left: 5px;
`

const _Option = styled.option`
  height: 40px;
  padding: 5px 0;
`

const SelectDropdown: React.FC<any> = props => {
  const { title, list, value, handleChange } = props

  return (
    <_SelectDropdown>
      <h5>{title}</h5>
      <_Select name="select" value={value} onChange={handleChange}>
        {list.map((item, i) => (
          <_Option key={i} value={item.ID}>
            {item.Name}
          </_Option>
        ))}
      </_Select>
    </_SelectDropdown>
  )
}

export default SelectDropdown
