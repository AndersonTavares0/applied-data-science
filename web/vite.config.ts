import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the project site from /ds-portfolio/. BrowserRouter uses
// the same base, and 404.html is a copy of index.html so deep links work there.
export default defineConfig({
  base: '/ds-portfolio/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Keep the charting runtime out of the app shell. The project routes
        // still import their charts synchronously so static route shells render
        // without a second request waterfall, but the vendor code caches apart
        // from the content and can be reused across routes.
        manualChunks(id) {
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) {
            return 'charts'
          }
          if (id.includes('node_modules/lucide-react')) return 'icons'
          if (id.includes('node_modules/react')) return 'react'
        },
      },
    },
  },
})
