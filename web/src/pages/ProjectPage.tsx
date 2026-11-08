import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ListTree } from 'lucide-react'
import { projectOrder } from '../content'
import type { ChartCopy, Lang, SectionId, Slug } from '../content/types'
import { useLang } from '../lib/useLang'
import { useSeo } from '../lib/useSeo'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { NotFoundPage } from './NotFoundPage'

const order: SectionId[] = [
  'question',
  'why',
  'data',
  'method',
  'findings',
  'implications',
  'limitations',
  'reproduction',
]

function Section({
  id,
  title,
  children,
}: {
  id: SectionId
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 border-t border-rule pt-9 first:border-t-0 first:pt-0">
      <h2
        id={`${id}-heading`}
        className="font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[2rem]"
      >
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="prose-editorial">
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  )
}

import RetailCharts from '../components/charts/bundles/RetailBundle'
import ModelCharts from '../components/charts/bundles/ModelBundle'
import VoiceCharts from '../components/charts/bundles/VoiceBundle'

function ChartGrid({
  slug,
  lang,
  sourceLabel,
  part,
}: {
  slug: Slug
  lang: Lang
  sourceLabel: string
  part: 1 | 2
}) {
  const { t } = useLang()
  const copy: Record<string, ChartCopy> = t.projects[slug].charts
  const Bundle =
    slug === 'retail-analytics' ? RetailCharts : slug === 'late-delivery' ? ModelCharts : VoiceCharts
  return <Bundle lang={lang} copy={copy} sourceLabel={sourceLabel} part={part} />
}

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  if (!slug || !projectOrder.includes(slug as Slug)) {
    return <NotFoundPage />
  }
  return <ProjectView key={slug} slug={slug as Slug} />
}

function ProjectView({ slug: key }: { slug: Slug }) {
  const { lang, t, path, project } = useLang()
  const data = t.projects[key]
  useSeo(data.metaTitle, data.metaDescription, lang)

  const index = projectOrder.indexOf(key)
  const previous = index > 0 ? projectOrder[index - 1] : null
  const next = index < projectOrder.length - 1 ? projectOrder[index + 1] : null

  return (
    <div className="mx-auto max-w-site px-4 pb-10 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <Link
        to={path('/#projects')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted no-underline hover:text-brand"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        {t.nav.backToProjects}
      </Link>

      <header className="mt-6 border-b border-rule pb-9">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{data.kicker}</p>
        <h1 className="mt-4 max-w-[22ch] font-display text-[2.4rem] font-semibold leading-[1.06] tracking-[-0.03em] text-ink sm:text-[3rem] lg:text-[3.35rem]">
          {data.title}
        </h1>
        <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-soft">{data.deck}</p>
        <p className="mt-4 text-xs text-muted">{t.nav.sourceNote}</p>

        <dl className="mt-8 grid gap-5 border-t border-rule pt-6 sm:grid-cols-3 sm:gap-6">
          {data.heroStats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                {stat.label}
              </dt>
              <dd className="mt-1.5 font-display text-[2rem] font-semibold leading-none tracking-[-0.02em] text-ink">
                {stat.value}
              </dd>
              <p className="mt-2 text-xs leading-relaxed text-muted">{stat.note}</p>
            </div>
          ))}
        </dl>
      </header>

      <details className="mt-7 rounded-lg border border-rule bg-surface px-4 py-3 lg:hidden">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
          {data.tocTitle}
        </summary>
        <nav className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {order.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-[13px] text-ink-soft no-underline hover:text-brand hover:underline"
            >
              {data.sectionLabels[id]}
            </a>
          ))}
        </nav>
      </details>

      <div className="mt-8 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <aside className="hidden lg:block" aria-label={data.tocTitle}>
          <div className="sticky top-24">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              <ListTree className="h-3.5 w-3.5" aria-hidden="true" />
              {data.tocTitle}
            </p>
            <nav className="mt-3 border-l border-rule">
              <ul className="space-y-1">
                {order.map((id) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="block border-l-2 border-transparent py-1 pl-3 text-[13px] leading-snug text-muted no-underline transition-colors hover:border-brand hover:text-ink"
                    >
                      {data.sectionLabels[id]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 border-t border-rule pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                {t.nav.projectNav}
              </p>
              <ul className="mt-2 space-y-1.5">
                {projectOrder.map((item) => (
                  <li key={item}>
                    <Link
                      to={project(item)}
                      className={
                        item === key
                          ? 'block text-[13px] font-semibold text-ink no-underline'
                          : 'block text-[13px] text-muted no-underline hover:text-brand hover:underline'
                      }
                    >
                      {t.projects[item].title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <article className="min-w-0 space-y-10">
          <Section id="question" title={data.sectionLabels.question}>
            <Paragraphs items={data.question} />
          </Section>

          <Section id="why" title={data.sectionLabels.why}>
            <Paragraphs items={data.why} />
          </Section>

          <Section id="data" title={data.sectionLabels.data}>
            <Paragraphs items={data.data} />
          </Section>

          <Section id="method" title={data.sectionLabels.method}>
            <div className="prose-editorial">
              {data.method.intro.map((item) => (
                <p key={item}>{item}</p>
              ))}
              <ol>
                {data.method.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </Section>

          <Section id="findings" title={data.sectionLabels.findings}>
            <Paragraphs items={data.findings.intro} />
            <ChartGrid slug={key} lang={lang} sourceLabel={t.common.sourceLabel} part={1} />
            <div className="prose-editorial">
              <ul>
                {data.findings.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              {data.findings.outro.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <ChartGrid slug={key} lang={lang} sourceLabel={t.common.sourceLabel} part={2} />
          </Section>

          <Section id="implications" title={data.sectionLabels.implications}>
            <Paragraphs items={data.implications.intro} />
            <div className="mt-6 space-y-6">
              {data.implications.items.map((item, itemIndex) => (
                <div key={item.title} className="border-l-2 border-brand pl-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    {String(itemIndex + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-[0.98rem] leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="limitations" title={data.sectionLabels.limitations}>
            <div className="rounded-xl border border-rule bg-surface-2 p-5 sm:p-6">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                {t.common.limitationLabel}
              </p>
              <ul className="space-y-2.5">
                {data.limitations.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section id="reproduction" title={data.sectionLabels.reproduction}>
            <p className="prose-editorial">{data.reproduction.intro}</p>
            <pre className="mt-5 overflow-x-auto rounded-xl border border-rule bg-surface-2 p-4 font-mono text-[13px] leading-relaxed text-ink">
              <code>{data.reproduction.commands.join('\n')}</code>
            </pre>
            <p className="mt-3 text-xs leading-relaxed text-muted">{data.reproduction.note}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="secondary" size="sm">
                <a href="https://github.com/AndersonTavares0/ds-portfolio">
                  {t.common.openSource}
                </a>
              </Button>
              <Badge variant="muted">{t.footer.licence}</Badge>
            </div>
          </Section>

          <nav
            aria-label={t.nav.projectNav}
            className="grid gap-3 border-t border-rule pt-6 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                to={project(previous)}
                className="group rounded-lg border border-rule bg-surface p-4 no-underline transition-colors hover:border-brand"
              >
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                  <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                  {t.nav.previousProject}
                </span>
                <span className="mt-1 block text-sm font-semibold text-ink">
                  {t.projects[previous].title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={project(next)}
                className="group rounded-lg border border-rule bg-surface p-4 text-right no-underline transition-colors hover:border-brand"
              >
                <span className="flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                  {t.nav.nextProject}
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-sm font-semibold text-ink">
                  {t.projects[next].title}
                </span>
              </Link>
            ) : null}
          </nav>
        </article>
      </div>
    </div>
  )
}
