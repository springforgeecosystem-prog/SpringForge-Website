import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#00ffaa',
        'accent-dark': '#00cc88',
        dark: {
          base: '#000000',
          card: '#0a0a0a',
          hover: '#111111',
          border: '#1a1a1a',
        },
        content: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          muted: '#555555',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
