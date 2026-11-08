import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the project site from /ds-portfolio/. BrowserRouter uses
// the same base, and 404.html is a copy of index.html so deep links work there.
export default defineConfig({
  base: '/ds-portfolio/',
  plugins: [react()],
  build: { outDir: 'dist' },
})
