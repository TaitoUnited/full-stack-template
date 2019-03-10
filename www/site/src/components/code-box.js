import React from 'react'
import styled from 'styled-components'

import LanguageSelector from './language-selector'

const CodeBox = ({ content, lang }) => {
  const languages = content.frontmatter.language_tabs
  return (
    <View>
      <LanguageSelector languages={languages} lang={lang} />
    </View>
  )
}

export default CodeBox

const View = styled.div`
  background-color: #2e3336;
  bottom: 0;
  display: block;
  font-size: 14px;
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
`
