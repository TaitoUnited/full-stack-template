import styled from 'styled-components'

export const Div = styled.div`
  background-color: #1e2123;
  box-sizing: border-box;
  clear: right;
  color: #fff;
  display: ${({ active }) => (active ? 'block' : 'none')};
  float: right;
  margin: 0;
  overflow: auto;
  -webkit-text-size-adjust: 100%;
  padding: 2em 28px;
  width: 50%;
`
