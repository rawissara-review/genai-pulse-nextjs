import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        thai: ["'IBM Plex Sans Thai'", 'sans-serif'],
        heading: ["'Barlow Condensed'", 'sans-serif'],
      },
      colors: {
        navy: '#0A1535',
        blue: { DEFAULT: '#00A3FF', light: '#00E5FF' },
        green: '#00D68F',
        yellow: '#FFD166',
        red: '#FF4D6A',
      },
    },
  },
  plugins: [],
};

export default config;
