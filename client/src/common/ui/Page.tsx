import { withTheme } from '@material-ui/core/styles';
import styled from '~styled';

const Page = withTheme()(styled.main`
  padding: ${props => props.theme.spacing.unit * 3}px;
`);

export default Page;
