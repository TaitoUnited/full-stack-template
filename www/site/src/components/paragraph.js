import styled from 'styled-components'
import { Blockquote } from './blockquote'

export const Paragraph = styled.p`
  display: block;
  box-sizing: border-box;
  padding: 0 28px;
  width: 50%;
  ${Blockquote} & {
    width: 100%;
  }
`
