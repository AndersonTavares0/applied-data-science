import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './lib/theme'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectPage } from './pages/ProjectPage'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="pt" element={<HomePage />} />
            <Route path="projects/:slug" element={<ProjectPage />} />
            <Route path="pt/projects/:slug" element={<ProjectPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="pt/about" element={<AboutPage />} />
            <Route path="projects" element={<Navigate to="/#projects" replace />} />
            <Route path="pt/projects" element={<Navigate to="/pt/#projects" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
