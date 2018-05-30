import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';

const Page = withTheme()(styled.main`
  padding: ${props => props.theme.spacing.unit * 3}px;
`);

export default Page;
