import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Carbon-inspired PrimeNG theme preset matching the Stitch "NextGen AI Job Portal" design system.
 * Primary: IBM Blue #0f62fe, surface: #f4f4f4, text: #161616
 */
export const MyPreset = definePreset(Aura, {
  primitive: {
    ibmBlue: palette('#0f62fe'),
    ibmGray: palette('#525252'),
    ibmGreen: palette('#198038'),
    ibmRed: palette('#da1e28'),
  },
  semantic: {
    primary: {
      50: '#edf5ff',
      100: '#d0e2ff',
      200: '#a6c8ff',
      300: '#78a9ff',
      400: '#4589ff',
      500: '#0f62fe',
      600: '#0043ce',
      700: '#002d9c',
      800: '#001d6c',
      900: '#001141',
      950: '#000a27',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f4f4f4',
          100: '#e0e0e0',
          200: '#c6c6c6',
          300: '#a8a8a8',
          400: '#8d8d8d',
          500: '#6f6f6f',
          600: '#525252',
          700: '#393939',
          800: '#262626',
          900: '#161616',
          950: '#0a0a0a',
        },
      },
    },
  },
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            primary: {
              background: '#0f62fe',
              borderColor: '#0f62fe',
              hoverBackground: '#0043ce',
              hoverBorderColor: '#0043ce',
              activeBackground: '#002d9c',
              activeBorderColor: '#002d9c',
              color: '#ffffff',
              focusRing: {
                color: '#0f62fe',
                shadow: '0 0 0 2px #ffffff, 0 0 0 4px #0f62fe',
              },
            },
            secondary: {
              background: '#ffffff',
              borderColor: '#e0e0e0',
              color: '#0f62fe',
              hoverBackground: '#f4f4f4',
              hoverBorderColor: '#e0e0e0',
              hoverColor: '#0043ce',
              activeBackground: '#e0e0e0',
              activeBorderColor: '#c6c6c6',
              activeColor: '#0f62fe',
            },
          },
        },
      },
    },
    inputtext: {
      colorScheme: {
        light: {
          root: {
            background: '#f4f4f4',
            borderColor: 'transparent',
            borderRadius: '0',
            shadow: 'none',
            color: '#161616',
            focusBorderColor: '#0f62fe',
            hoverBorderColor: '#8d8d8d',
          },
        },
      },
    },
    card: {
      colorScheme: {
        light: {
          root: {
            background: '#f4f4f4',
            borderRadius: '0',
            shadow: 'none',
          },
        },
      },
    },
  },
});
