import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLang } from '../lib/useLang'
import { useSeo } from '../lib/useSeo'
import { Button } from '../components/ui/button'

export function NotFoundPage() {
  const { lang, t, path } = useLang()
  useSeo(`${t.nav.notFoundTitle} — Anderson Tavares`, t.nav.notFoundBody, lang)

  return (
    <div className="mx-auto flex max-w-site flex-col items-start px-4 pb-20 pt-20 sm:px-6 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">404</p>
      <h1 className="mt-4 max-w-[22ch] font-display text-[2.5rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[3.2rem]">
        {t.nav.notFoundTitle}
      </h1>
      <p className="mt-4 max-w-prose text-base leading-relaxed text-ink-soft">{t.nav.notFoundBody}</p>
      <Button asChild className="mt-7">
        <Link to={path('/')}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t.nav.notFoundCta}
        </Link>
      </Button>
    </div>
  )
}
