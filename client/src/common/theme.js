import { createMuiTheme } from '@material-ui/core/styles';
// import * as Colors from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    // primary: {
    //   // light: will be calculated from palette.primary.main,
    //   main: '#26984E'
    //   // dark: will be calculated from palette.primary.main,
    //   // contrastText: will be calculated to contast with
    //   //   palette.primary.main
    // }
  }
});

export const styles = th => ({
  page: {
    padding: th.spacing.unit * 3
  }
});

export default theme;
