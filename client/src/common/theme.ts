import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

export type Theme = typeof theme;

export default theme;
