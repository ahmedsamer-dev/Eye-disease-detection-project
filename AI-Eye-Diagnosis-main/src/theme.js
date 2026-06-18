import { createTheme } from '@mui/material/styles';

// ── Brand & Neutral Palette ─────────────────────────────
const PRIMARY = '#2D598F';

const slate = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
};

const lightPalette = {
  mode: 'light',
  primary: {
    main: PRIMARY,
    dark: '#1e3d64',
    light: '#4270b3',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#5ab4e8',
    light: '#85cfff',
    contrastText: '#ffffff',
  },
  background: {
    default: slate[50],
    paper: '#ffffff',
  },
  text: {
    primary: slate[900],
    secondary: slate[600],
    disabled: slate[400],
  },
  divider: slate[200],
  action: {
    hover: 'rgba(15, 23, 42, 0.04)',
    selected: 'rgba(15, 23, 42, 0.08)',
    disabled: slate[300],
    disabledBackground: slate[100],
  },
};

const darkPalette = {
  mode: 'dark',
  primary: {
    main: PRIMARY,
    dark: '#1e3d64',
    light: '#4270b3',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#5ab4e8',
    light: '#85cfff',
    contrastText: '#ffffff',
  },
  background: {
    default: slate[900],
    paper: slate[800],
  },
  text: {
    primary: slate[50],
    secondary: slate[400],
    disabled: slate[600],
  },
  divider: 'rgba(255, 255, 255, 0.08)',
  action: {
    hover: 'rgba(255, 255, 255, 0.05)',
    selected: 'rgba(255, 255, 255, 0.08)',
    disabled: slate[700],
    disabledBackground: slate[800],
  },
};

// ── Soft Shadows Only ───────────────────────────────────
const shadows = {
  header: {
    light: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
    dark: '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15)',
  },
  card: {
    light: '0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -2px rgba(0,0,0,0.03)',
    dark: '0 4px 6px -1px rgba(0,0,0,0.15), 0 2px 4px -2px rgba(0,0,0,0.1)',
  },
  cardHover: {
    light: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.03)',
    dark: '0 10px 15px -3px rgba(0,0,0,0.2), 0 4px 6px -4px rgba(0,0,0,0.15)',
  },
  button: {
    light: '0 4px 14px rgba(45,89,143,0.18)',
    dark: '0 4px 14px rgba(45,89,143,0.28)',
  },
  elevated: {
    light: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.03)',
    dark: '0 20px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.15)',
  },
};

export function getShadow(mode, key) {
  return shadows[key]?.[mode] || shadows[key]?.light || 'none';
}

export function getTheme(mode = 'light') {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  return createTheme({
    palette,
    customShadows: shadows,
    typography: {
      fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
      h1: { fontFamily: '"Inter", sans-serif', fontWeight: 700 },
      h2: { fontFamily: '"Inter", sans-serif', fontWeight: 700 },
      h3: { fontFamily: '"Inter", sans-serif', fontWeight: 600 },
      h4: { fontFamily: '"Inter", sans-serif', fontWeight: 600 },
      h5: { fontFamily: '"Inter", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Inter", sans-serif', fontWeight: 600 },
      button: { fontFamily: '"Inter", sans-serif', fontWeight: 600 },
      body1: { fontFamily: '"Inter", sans-serif' },
      body2: { fontFamily: '"Inter", sans-serif' },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            borderRadius: 10,
            transition: 'all 0.2s ease',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            boxShadow: getShadow(mode, 'card'),
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
        styleOverrides: {
          root: ({ theme: t }) => ({
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              backgroundColor: t.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#ffffff',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
              '& fieldset': {
                borderColor: t.palette.divider,
              },
              '&:hover fieldset': {
                borderColor: t.palette.text.secondary,
              },
              '&.Mui-focused fieldset': {
                borderColor: t.palette.primary.main,
                borderWidth: 1.5,
              },
            },
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: getShadow(mode, 'header'),
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
          '*': {
            fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          },
        },
      },
    },
  });
}
