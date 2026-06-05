import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const MyPreset = definePreset(Aura, {
  primitive: {
    brandPrimary: palette('#4F46E5'),
    brandSecondary: palette('#06B6D4'),
    brandAccent: palette('#A54100')
  },
  semantic: {
    primary: {
      50: '{brandPrimary.50}',
      100: '{brandPrimary.100}',
      200: '{brandPrimary.200}',
      300: '{brandPrimary.300}',
      400: '{brandPrimary.400}',
      500: '{brandPrimary.500}',
      600: '{brandPrimary.600}',
      700: '{brandPrimary.700}',
      800: '{brandPrimary.800}',
      900: '{brandPrimary.900}',
      950: '{brandPrimary.950}'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712'
        }
      }
    }
  },
  borderRadius: {
    none: '0px',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px'
  },
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            primary: {
              background: '#4F46E5',
              borderColor: '#4F46E5',
              hoverBackground: '#4338CA',
              hoverBorderColor: '#4338CA',
              activeBackground: '#3730A3',
              activeBorderColor: '#3730A3',
              color: '#ffffff',
              focusRing: {
                color: '#4F46E5',
                shadow: '0 0 0 2px #ffffff, 0 0 0 4px #4F46E5'
              }
            },
            secondary: {
              background: '#ffffff',
              borderColor: '#E5E7EB',
              color: '#4F46E5',
              hoverBackground: '#F3F4F6',
              hoverBorderColor: '#E5E7EB',
              hoverColor: '#4F46E5',
              activeBackground: '#D1D5DB',
              activeBorderColor: '#D1D5DB',
              activeColor: '#4F46E5',
              focusRing: {
                color: '#4F46E5',
                shadow: '0 0 0 2px #ffffff, 0 0 0 4px #4F46E5'
              }
            }
          }
        }
      }
    }
  }
});
