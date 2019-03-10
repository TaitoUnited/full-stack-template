import React from 'react'
import { navigate } from '@reach/router'
import styled from 'styled-components'

const toggleActive = (e, language) => {
  navigate(`/?${language}`)
}

const LanguageSelector = ({ languages, lang }) => {
  return (
    <View>
      {languages.map(language => (
        <Item
          href="#"
          key={language}
          active={language === lang}
          onClick={e => toggleActive(e, language)}
        >
          {language}
        </Item>
      ))}
    </View>
  )
}

export default LanguageSelector

const View = styled.div`
  background-color: #1e2224;
  display: block;
  position: fixed;
  width: 100%;
  z-index: 50;
`

const Item = styled.a`
  display: block;
  float: left;
  font-size: 14px;
  font-weight: bold;
  background-color: ${({ active }) => (active ? '#2e3336' : 'inherit')};
  color: #fff;
  text-decoration: none;
  padding: 0 10px;
  line-height: 30px;
  outline: 0;
  &:active,
  &:focus {
    background-color: #2e3336;
  }
`
