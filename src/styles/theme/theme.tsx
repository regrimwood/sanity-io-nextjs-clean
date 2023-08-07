import { createTheme } from '@mui/material/styles';
import { createBreakpoints } from '@mui/system';

declare module '@mui/material/styles' {
  // eslint-disable-next-line no-unused-vars
  interface TypographyVariants {
    // customNameHere: React.CSSProperties; // TODO
  }

  // allow configuration using `createTheme`
  // eslint-disable-next-line no-unused-vars
  interface TypographyVariantsOptions {
    // customNameHere?: React.CSSProperties; // TODO
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  // eslint-disable-next-line no-unused-vars
  interface TypographyPropsVariantOverrides {
    // customNameHere: true; // TODO
  }
}

declare module '@mui/material/styles/createPalette' {
  // eslint-disable-next-line no-unused-vars
  interface CommonColors {
    solidWhite: string;
    white: string;
    beige: string;
    lightBeige: string;
    gold: string;
    charcoal: string;
    lightGray: string;
    darkGray: string;
  }
}

const breakpoints = createBreakpoints({});

const paletteTheme = createTheme({
  palette: {
    primary: {
      main: '#F7F7F7',
    },
    secondary: {
      main: '#212121',
    },
    text: {
      primary: '#212121',
    },
    common: {
      solidWhite: '#ffffff',
      white: '#F7F7F7',
      charcoal: '#212121',
    },
    divider: '#F7F7F7',
  },
});

const theme = createTheme({
  ...paletteTheme,
  typography: {
    fontFamily:
      '"neue-haas-grotesk-display", "Helvetica", "Roboto", "Arial", sans-serif',

    allVariants: {
      fontFamily:
        '"neue-haas-grotesk-display", "Helvetica", "Roboto", "Arial", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.01em',
      lineHeight: 'initial',
    },

    h1: {
      textTransform: 'uppercase',
      [breakpoints.up('xs')]: {
        fontSize: '30px',
      },
      [breakpoints.up('md')]: {
        fontSize: '60px',
      },
    },

    h2: {
      textTransform: 'uppercase',
      [breakpoints.up('xs')]: {
        fontSize: '24px',
      },
      [breakpoints.up('md')]: {
        fontSize: '36px',
      },
    },

    h3: {
      [breakpoints.up('xs')]: {
        fontSize: '16px',
      },
      [breakpoints.up('md')]: {
        fontSize: '20px',
      },
    },

    h4: {
      [breakpoints.up('xs')]: {
        fontSize: '20px',
      },
      [breakpoints.up('md')]: {
        fontSize: '24px',
      },
    },

    h5: {
      textTransform: 'uppercase',
      [breakpoints.up('xs')]: {
        fontSize: '14px',
      },
      [breakpoints.up('md')]: {
        fontSize: '16px',
      },
    },

    h6: {
      [breakpoints.up('xs')]: {
        fontSize: '16px',
      },
      [breakpoints.up('md')]: {
        fontSize: '24px',
      },
    },

    body1: {
      [breakpoints.up('xs')]: {
        fontSize: '14px',
      },
      [breakpoints.up('md')]: {
        fontSize: '16px',
      },
    },

    body2: {
      [breakpoints.up('xs')]: {
        fontSize: '12px',
      },
      [breakpoints.up('md')]: {
        fontSize: '14px',
      },
    },

    button: {
      textTransform: 'none',
      [breakpoints.up('xs')]: {
        fontSize: '12px',
      },
      [breakpoints.up('md')]: {
        fontSize: '14px',
      },
    },

    caption: {
      [breakpoints.up('xs')]: {
        fontSize: '10px',
      },
      [breakpoints.up('md')]: {
        fontSize: '12px',
      },
    },
  },

  components: {
    MuiLinearProgress: {
      defaultProps: {
        color: 'secondary',
      },
    },
  },
});

export default theme;
