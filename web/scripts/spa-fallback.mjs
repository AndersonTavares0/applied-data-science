// GitHub Pages serves 404.html for unknown paths. Copying the built shell there
// lets BrowserRouter resolve deep links such as /ds-portfolio/projects/about.
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve(import.meta.dirname, '..', 'dist')
const index = resolve(dist, 'index.html')
const fallback = resolve(dist, '404.html')

if (!existsSync(index)) {
  console.error('spa-fallback: dist/index.html is missing; run vite build first')
  process.exit(1)
}

copyFileSync(index, fallback)
console.log('spa-fallback: wrote dist/404.html')
