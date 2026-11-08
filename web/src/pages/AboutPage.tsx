import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-react'
import { useLang } from '../lib/useLang'
import { useSeo } from '../lib/useSeo'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

export function AboutPage() {
  const { lang, t, path } = useLang()
  const about = t.about
  useSeo(about.metaTitle, about.metaDescription, lang)

  return (
    <div className="mx-auto max-w-site px-4 pb-8 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <Link
        to={path('/')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted no-underline hover:text-brand"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {t.common.backHome}
      </Link>

      <div className="mt-7 grid gap-10 border-b border-rule pb-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {t.nav.about}
          </p>
          <h1 className="mt-3 font-display text-[2.7rem] font-semibold leading-none tracking-[-0.03em] text-ink sm:text-[3.4rem]">
            {about.title}
          </h1>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent bg-surface px-3 py-1 text-xs font-semibold text-accent">
            {about.lookingFor}
          </p>
        </div>
        <div className="prose-editorial">
          {about.intro.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">{about.toolsHeading}</h2>
          <dl className="mt-5 divide-y divide-rule border-y border-rule">
            {about.tools.map((tool) => (
              <div key={tool.area} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <dt className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] text-muted">
                  {tool.area}
                </dt>
                <dd className="text-sm leading-relaxed text-ink-soft">{tool.items}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">{about.principlesHeading}</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {about.principles.map((principle, index) => (
              <div key={principle.title} className="border-t border-rule pt-4">
                <span className="font-mono text-[10px] tracking-[0.1em] text-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-1.5 text-base font-semibold text-ink">{principle.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-14 rounded-xl border border-rule border-t-2 border-t-brand bg-surface p-6 shadow-plate sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-end">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">{about.contactHeading}</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{about.contactNote}</p>
            <p className="mt-5 text-xs leading-relaxed text-muted">{about.note}</p>
          </div>
          <ul className="grid gap-3">
            {about.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex flex-col items-start justify-between gap-1 rounded-lg border border-rule bg-paper px-4 py-3 no-underline transition-colors hover:border-brand sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                    {link.label}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                    {link.value}
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-rule pt-5">
          <Button asChild variant="primary" size="sm">
            <a href="mailto:anderson.g.tavares@gmail.com">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {lang === 'pt' ? 'Enviar e-mail' : 'Send an email'}
            </a>
          </Button>
          <Badge variant="muted">{t.footer.licence}</Badge>
          <Link
            to={path('/#projects')}
            className="text-xs font-semibold text-brand no-underline hover:underline"
          >
            {t.home.projectsHeading}
          </Link>
        </div>
      </section>
    </div>
  )
}
