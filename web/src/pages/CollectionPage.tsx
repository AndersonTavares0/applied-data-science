import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { projectOrder } from '../content'
import { useLang } from '../lib/useLang'
import { useSeo } from '../lib/useSeo'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

export function CollectionPage() {
  const { lang, t, path, project } = useLang()
  const collection = t.collection
  useSeo(collection.metaTitle, collection.metaDescription, lang)

  return (
    <div className="mx-auto max-w-site px-4 pb-8 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <Link
        to={path('/')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted no-underline hover:text-brand"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {t.common.backHome}
      </Link>

      <section className="mt-7 border-b border-rule pb-12">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {collection.eyebrow}
            </p>
            <p className="mt-2 font-display text-base italic text-muted">{collection.subtitle}</p>
            <h1 className="mt-5 max-w-[20ch] font-display text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[3rem] lg:text-[3.4rem]">
              {collection.title}
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">{collection.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={project('retail-analytics')}>
                  {collection.cta.primary}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href="#method">{collection.cta.secondary}</a>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="plate grid grid-cols-2 gap-x-5 gap-y-6 rounded-xl border border-rule border-t-2 border-t-brand bg-surface p-6 shadow-plate sm:p-7">
              {collection.stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] text-ink">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">{stat.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 py-12 lg:grid-cols-[0.8fr_2fr] lg:gap-14">
        <h2 className="font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.02em]">
          {collection.scope.heading}
        </h2>
        <div className="prose-editorial max-w-prose">
          {collection.scope.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="border-y border-rule bg-surface">
        <div className="mx-auto max-w-site px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-prose">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-[2rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.4rem]">
                {collection.studiesHeading}
              </h2>
              <Badge variant="outline">01–03</Badge>
            </div>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">{collection.studiesIntro}</p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-7">
            {projectOrder.map((slug) => {
              const study = t.home.projects.find((item) => item.slug === slug)
              if (!study) return null
              return (
                <article
                  key={slug}
                  className="group flex flex-col border-t-2 border-t-rule pt-5 transition-colors hover:border-t-brand"
                >
                  <span className="font-mono text-[11px] tracking-[0.1em] text-muted">{study.number}</span>
                  <h3 className="mt-3 font-display text-[1.35rem] font-semibold leading-snug text-ink">
                    {study.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{study.question}</p>
                  <p className="mt-5 font-display text-[1.4rem] font-semibold leading-[1.2] tracking-[-0.01em] text-ink">
                    {study.headline}
                  </p>
                  <div className="mt-5 flex flex-1 items-end">
                    <Link
                      to={project(slug)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand no-underline hover:underline"
                    >
                      {study.cta}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                  <span className="mt-3 text-[11px] text-muted">{study.method}</span>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="method" className="scroll-mt-24 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_2fr] lg:gap-14">
          <div>
            <h2 className="font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.02em]">
              {collection.method.heading}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{collection.method.intro}</p>
          </div>
          <div>
            <ol className="divide-y divide-rule border-y border-rule">
              {collection.method.steps.map((step, index) => (
                <li key={step} className="grid gap-2 py-4 sm:grid-cols-[2.5rem_1fr] sm:gap-4">
                  <span className="font-mono text-[10px] tracking-[0.1em] text-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm leading-relaxed text-ink-soft">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-muted">{collection.method.note}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-rule py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_2fr] lg:gap-14">
          <h2 className="font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.02em]">
            {collection.limitations.heading}
          </h2>
          <div>
            <p className="max-w-prose text-[0.98rem] leading-relaxed text-ink-soft">
              {collection.limitations.intro}
            </p>
            <ul className="mt-6 space-y-4">
              {collection.limitations.items.map((item) => (
                <li
                  key={item}
                  className="border-l-2 border-l-rule pl-4 text-sm leading-relaxed text-ink-soft"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pt-4">
        <div className="grid gap-6 rounded-xl border border-rule bg-surface p-7 shadow-plate sm:p-10 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              {collection.eyebrow}
            </p>
            <h2 className="mt-3 max-w-[24ch] font-display text-[1.8rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.1rem]">
              {t.home.closing.heading}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button asChild variant="outline">
              <Link to={path('/about')}>
                {t.nav.about}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
