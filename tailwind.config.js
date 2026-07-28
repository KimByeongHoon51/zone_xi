/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#14532D',
        warn: '#DC2626',
        overcrowd: '#B45309',
        ink: '#1F2933',
        subtle: '#64748B',
        muted: '#94A3B8',
        pitch: '#E9EEEA',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
