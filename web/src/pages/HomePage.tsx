import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Clock3,
  Database,
  FileWarning,
  GitBranch,
  Sigma,
} from 'lucide-react'
import type { HomeContent } from '../content/types'
import { p01, formatDecimal } from '../data'
import { useLang } from '../lib/useLang'
import { useSeo } from '../lib/useSeo'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

const icons = {
  pipeline: GitBranch,
  clock: Clock3,
  uncertainty: Sigma,
  limits: FileWarning,
} as const

function ProjectCard({ project }: { project: HomeContent['projects'][number] }) {
  const { t, project: href } = useLang()
  return (
    <article className="group flex flex-col border-t-2 border-t-rule pt-5 transition-colors hover:border-t-brand">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] tracking-[0.1em] text-muted">{project.number}</span>
        <Badge variant="outline">{t.common.published}</Badge>
      </div>
      <h3 className="mt-4 font-display text-[1.35rem] font-semibold leading-snug text-ink">
        {project.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{project.question}</p>
      <p className="mt-6 font-display text-[1.55rem] font-semibold leading-[1.2] tracking-[-0.01em] text-ink">
        {project.headline}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{project.headlineNote}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="muted">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="mt-6 flex flex-1 items-end">
        <Link
          to={href(project.slug)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand no-underline hover:underline"
        >
          {project.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
      <span className="mt-3 text-[11px] text-muted">{project.method}</span>
    </article>
  )
}

export function HomePage() {
  const { lang, t, path, project } = useLang()
  const home = t.home
  useSeo(home.metaTitle, home.metaDescription, lang)
  const lateValue = formatDecimal(p01.deliverySummary.late_review, lang, 2)
  const onTimeValue = formatDecimal(p01.deliverySummary.on_time_review, lang, 2)

  return (
    <>
      <section className="mx-auto max-w-site px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {home.eyebrow}
            </p>
            <p className="mt-2 font-display text-base italic text-muted">{home.subtitle}</p>
            <h1 className="mt-5 max-w-[18ch] font-display text-[2.55rem] font-semibold leading-[1.04] tracking-[-0.03em] text-ink sm:text-[3.2rem] lg:text-[3.7rem]">
              {home.title}
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">{home.lead}</p>
            <p className="mt-4 max-w-prose text-[0.95rem] leading-relaxed text-muted">{home.thesis}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={project('retail-analytics')}>
                  {home.primaryCta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to={path('/#projects')}>{home.secondaryCta}</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="plate rounded-xl border border-rule border-t-2 border-t-brand bg-surface p-6 shadow-plate sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {home.heroPlate.label}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-5">
                <div>
                  <p className="font-display text-[3.6rem] font-semibold leading-none tracking-[-0.04em] text-late">
                    {lateValue}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                    {home.heroPlate.lateLabel}
                  </p>
                </div>
                <div className="border-l border-rule pl-5">
                  <p className="font-display text-[3.6rem] font-semibold leading-none tracking-[-0.04em] text-brand">
                    {onTimeValue}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
                    {home.heroPlate.onTimeLabel}
                  </p>
                </div>
              </div>
              <p className="mt-6 border-t border-rule pt-4 text-xs leading-relaxed text-muted">
                {home.heroPlate.footnote}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-rule bg-surface-2">
        <div className="mx-auto max-w-site px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {home.collectionCard.eyebrow}
              </p>
              <h2 className="mt-3 max-w-[22ch] font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.1rem]">
                {home.collectionCard.title}
              </h2>
              <p className="mt-2 font-display text-[0.98rem] italic text-muted">
                {home.collectionCard.subtitle}
              </p>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-soft">
                {home.collectionCard.body}
              </p>
              <div className="mt-5">
                <Button asChild variant="secondary">
                  <Link to={path('/collections/olist')}>
                    {home.collectionCard.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
            <ul className="divide-y divide-rule border-y border-rule">
              {home.projects.map((projectItem) => (
                <li key={projectItem.slug}>
                  <Link
                    to={project(projectItem.slug)}
                    className="group flex items-center gap-3 px-1 py-3.5 no-underline"
                  >
                    <span className="font-mono text-[10px] text-muted">{projectItem.number}</span>
                    <span className="flex-1 text-sm font-semibold leading-snug text-ink group-hover:text-brand">
                      {projectItem.title}
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="projects" className="border-b border-rule bg-surface">
        <div className="mx-auto max-w-site px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-prose">
            <h2 className="font-display text-[2rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.4rem]">
              {home.projectsHeading}
            </h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-soft">{home.projectsIntro}</p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-7">
            {home.projects.map((projectItem) => (
              <ProjectCard key={projectItem.slug} project={projectItem} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-site px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_2fr] lg:gap-14">
          <div>
            <h2 className="font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.02em]">
              {home.work.heading}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{home.work.intro}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {home.work.items.map((item) => {
              const Icon = icons[item.icon as keyof typeof icons] ?? Database
              return (
                <div key={item.title} className="border-t border-rule pt-4">
                  <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                  <h3 className="mt-3 text-base font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-rule bg-surface-2">
        <div className="mx-auto max-w-site px-4 py-7 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
            {home.credibility.map((item) => (
              <div key={item.label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                  {item.label}
                </dt>
                <dd className="mt-1 font-display text-lg font-semibold text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-site px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-xl border border-rule bg-surface p-7 shadow-plate sm:p-10 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div>
            <h2 className="max-w-[24ch] font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.2rem]">
              {home.closing.heading}
            </h2>
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-soft">
              {home.closing.body}
            </p>
          </div>
          <div className="lg:text-right">
            <Button asChild variant="outline">
              <Link to={path('/about')}>
                {home.closing.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
