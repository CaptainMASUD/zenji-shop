/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        graphite: '#151515',
        ivory: '#F2EEE6',
        silver: '#A6A6A6',
        line: '#292929',
        crimson: '#D72638',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Instrument Sans"', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
        jp: ['"Noto Sans JP"', 'sans-serif'],
        nunito: ['"Nunito"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
      },
      screens: {
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};
