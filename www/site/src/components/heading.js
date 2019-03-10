import styled from 'styled-components'

export const Heading1 = styled.h1`
  background-color: white;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid silver;
  box-sizing: border-box;
  clear: both;
  display: block;
  font-size: 25px;
  line-height: normal;
  padding: 0.5em 28px;
  margin-bottom: 21px;
  margin-right: 50%;
  margin-top: 2em;
  width: 50%;
  &:first-child {
    margin-top: 0;
    border-top-width: 0;
  }
`

export const Heading2 = styled.h2`
  padding: 0.5em 28px;
`

export const Heading3 = styled.h3`
  font-size: 15px;
  margin-top: 2.5em;
  margin-bottom: 0.8em;
  padding: 0.5em 28px;
`
