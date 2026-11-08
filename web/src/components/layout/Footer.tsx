import { Link } from 'react-router-dom'
import { Code2, Link2, Mail } from 'lucide-react'
import { projectOrder } from '../../content'
import { useLang } from '../../lib/useLang'

export function Footer() {
  const { t, path, project } = useLang()

  return (
    <footer className="mt-24 border-t border-rule bg-surface">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-xl font-semibold text-ink">Anderson Tavares</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{t.footer.line}</p>
          <p className="mt-5 max-w-sm text-xs leading-relaxed text-muted">{t.footer.note}</p>
        </div>

        <nav aria-label={t.nav.projects}>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{t.nav.projects}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                to={path('/collections/olist')}
                className="text-ink-soft no-underline hover:text-brand hover:underline"
              >
                {t.nav.collection}
              </Link>
            </li>
            {projectOrder.map((slug) => (
              <li key={slug}>
                <Link to={project(slug)} className="text-ink-soft no-underline hover:text-brand hover:underline">
                  {t.projects[slug].title}
                </Link>
              </li>
            ))}
            <li>
              <Link to={path('/about')} className="text-ink-soft no-underline hover:text-brand hover:underline">
                {t.nav.about}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
            {t.footer.source}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="https://github.com/AndersonTavares0/applied-data-science"
                className="inline-flex items-center gap-2 text-ink-soft no-underline hover:text-brand hover:underline"
              >
                <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/andersonlimatavares"
                className="inline-flex items-center gap-2 text-ink-soft no-underline hover:text-brand hover:underline"
              >
                <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="mailto:anderson.g.tavares@gmail.com"
                className="inline-flex items-center gap-2 text-ink-soft no-underline hover:text-brand hover:underline"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                anderson.g.tavares@gmail.com
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            {t.nav.sourceNote} {t.footer.licence}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">{t.nav.builtWith}</p>
        </div>
      </div>
    </footer>
  )
}
