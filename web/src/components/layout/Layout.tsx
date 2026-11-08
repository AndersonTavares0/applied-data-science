import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { content, getLang } from '../../content'
import { useLang } from '../../lib/useLang'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { pathname, hash } = useLocation()
  const { lang, t } = useLang()

  useEffect(() => {
    document.documentElement.lang = content[lang].htmlLang
  }, [lang])

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])

  // Keep getLang referenced: the language is also derived from the path here so
  // a direct link to /pt/about gets the right document language on first paint.
  void getLang(pathname)

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-paper"
      >
        {t.nav.skip}
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
