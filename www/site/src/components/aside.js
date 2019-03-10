import styled from 'styled-components'

export const Aside = styled.aside`
  background: ${({ className }) =>
    className.includes('warning')
      ? '#c97a7e'
      : className.includes('success')
      ? '#6ac174'
      : 'rgb(143, 188, 212)'};
  padding: 1em 28px;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  line-height: 1.6;
  margin-right: 50%;
  box-sizing: border-box;
  display: block;
`
