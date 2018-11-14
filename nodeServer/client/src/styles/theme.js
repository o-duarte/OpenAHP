import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';

// Default theme for config the app theme.
const defaultTheme = createMuiTheme();

/*
 * Global elements.
 */

const PALETTE = {
  primary: {
    light: grey[500],
    main: grey[600],
    dark: grey[700],
    contrastText: defaultTheme.palette.getContrastText(grey[900])
  }
};

const TYPOGRAPHY = {
  title: {
    fontSize: 36,
    fontWeight: 700,
    fontFamily: '"Raleway",  sans-serif;',
    lineHeight: '1.16667em',
    color: 'rgba(0, 0, 0, 0.87)'
  }
};

/*
 * Material ui theme setup.
 */

const theme = createMuiTheme({
  // overrides: {
  //   MuiButton: {
  //     root: {}
  //   },
  //   MuiTypography: {}
  // },
  overrides: {},

  palette: {
    tonalOffset: 0.07,
    primary: {
      light: blue[500],
      main: blue[600],
      dark: blue[700],
      contrastText: defaultTheme.palette.getContrastText(blue[900])
    }
  },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: 12,
    title: TYPOGRAPHY.title
  },
  custom: {
    globals: {
      flex: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    },
    header: {
      icon: {
        color: PALETTE.primary.main
      }
    }
  }
});

export { theme };
