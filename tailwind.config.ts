/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
import { type Config } from "tailwindcss";

export default {
  content: ['node_modules/daisyui/dist/**/*.js', 'node_modules/react-daisyui/dist/**/*.js', "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridRow: {
        'span-7': 'span 7 / span 7',
        'span-8': 'span 8 / span 8',
        'span-9': 'span 9 / span 9',
        'span-10': 'span 10 / span 10',
        'span-11': 'span 11 / span 11',
        'span-12': 'span 12 / span 12',
      },
      aspectRatio: {
        '4/3': '4 / 3',
        '2/3': '2 / 3',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        '1000': '1000',
        '10000': '10000',
        '99999': '99999',
      },
    },
  },
  safelist: [
    {
      pattern: /(col|row)-span-.+/
    },
    {
      pattern: /.+-slate-.+/
    },
    {
      pattern: /grow/
    },
    {
      pattern: /w-1\/6/
    },
  ],
  daisyui: {
    themes: [
      {
        rfbw: {
          "color-scheme": "dark",
          "primary": "#55e847",
          "secondary": "#4ade80",
          "accent": "#a855f7",
          "neutral": "#1f2937",
          "base-100": "#111827",
          "info": "#94a3e0",
          "success": "#a3e635",
          "warning": "#facc15",
          "error": "#ef4444",
          "--rounded-btn": "1.9rem",
          "--bc": "220.91 43.304% 88.196%;"
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography')
  ],
} satisfies Config;
