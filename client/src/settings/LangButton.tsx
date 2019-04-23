import styled from 'styled-components';

const LangButton = styled('button')<{ active: boolean }>`
  color: ${props => (props.active ? '#3f51b5' : '#222')};
  border: 2px solid ${props => (props.active ? '#3f51b5' : '#ddd')};
  border-radius: 12px;
  height: 54px;
  width: 54px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  background-color: transparent;
  margin-right: 16px;
`;

export default LangButton;
