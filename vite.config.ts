import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' 로 두면 GitHub Pages·Netlify·Vercel 어디서든 하위 경로 배포가 가능하다.
export default defineConfig({
  plugins: [react()],
  base: './',
});
