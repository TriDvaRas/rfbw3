/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
import { type Config } from "tailwindcss";

export default {
  content: ['node_modules/daisyui/dist/**/*.js', 'node_modules/react-daisyui/dist/**/*.js', "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
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
