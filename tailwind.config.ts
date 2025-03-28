import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        'lg-card': '1390px',
        'hero-xl': '1350px',
        '4k': '2100px',
      },
      colors: {
        // Blacks & Very Dark Grays
        'mb-black-deep': '#010101',
        'mb-black': '#09090B',
        'mb-black-50': '#18181A',
        'mb-gray-900': '#0D0D0F',
        'mb-gray-850': '#0F172A',
        'mb-gray-700': '#1A1A1E',
        'mb-dark-blue-2': '#1a1a24',
        'mb-gray-650': '#232323',
        'mb-gray-250': '#24242B',
        'mb-gray-600': '#27272A',
        'mb-gray-610': '#2D2D2D',
        'mb-gray-620': '#27272F',

        // Dark Blues & Indigos
        'mb-dark-blue': '#17171F',
        'mb-gray-1000': '#171720',
        'mb-gray-950': '#141418',
        'mb-gray-550': '#18181B',
        'mb-indigo-20': '#414D7D33',
        'mb-indigo-30': '#414D7D40',
        'mb-indigo-50': '#414d7d8d',

        // Mid Grays
        'mb-gray-800': '#334155',
        'mb-gray-750': '#313e52',
        'mb-gray-500': '#475569',
        'mb-gray-450': '#45536B',
        'mb-gray-150': '#7C7C7C',
        'mb-gray-100': '#89898A',

        // Light Grays & Silvers
        'mb-gray-400': '#94A3B8',
        'mb-gray-350': '#A1A1A9',
        'mb-gray-200': '#B4B4B4',
        'mb-silver': '#B2B2B3',
        'mb-gray-50': '#BABDC2',
        'mb-gray-300': '#CBD5E1',

        // Whites
        'mb-white-50': '#F8FAFC',
        'mb-white-100': '#FAFAFA',
        'mb-white-300': '#EEEEEE',

        // Blues
        'mb-blue-10': '#3c82f61a',
        'mb-blue-20': '#3c82f633',
        'mb-blue': '#3C82F6',
        'mb-blue-30': '#60A5FA4D',
        'mb-blue-100': '#60A5FA',
        'mb-blue-transparent': '#1e293b00',

        // Greens
        'mb-green-20': '#22C55E33',
        'mb-green-100': '#22C55E',
        'mb-green': '#70FF7D',

        // Reds
        'mb-red-20': '#EF444433',
        'mb-red-30': '#EF44444D',
        'mb-red-100': '#EF4444',
        'mb-red': '#FF2424',

        // Purples
        'mb-purple-20': '#C084FC33',
        'mb-purple': '#C084FC',
        'mb-purple-70': '#E087FFB2',

        // Teals
        'mb-teal-50': '#CAFFF280',
        'mb-teal': '#CAFFF2',

        // Olives
        'mb-olive-20': '#444b3340',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      boxShadow: {
        custom: '0px 0px 10px 4px rgba(224, 135, 255, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
