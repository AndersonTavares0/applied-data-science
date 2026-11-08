import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react'
import { projectOrder } from '../../content'
import type { Lang } from '../../content/types'
import { useLang } from '../../lib/useLang'
import { useTheme } from '../../lib/theme'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const { t } = useLang()
  const label = theme === 'dark' ? t.nav.themeLight : t.nav.themeDark
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="shrink-0"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}

function LanguageSwitch({ lang }: { lang: Lang }) {
  const { switchTo, t } = useLang()
  const next = lang === 'en' ? 'PT' : 'EN'
  return (
    <Link
      to={switchTo}
      hrefLang={lang === 'en' ? 'pt-BR' : 'en'}
      aria-label={t.nav.switchLanguage}
      className="inline-flex h-9 items-center rounded-md border border-rule px-2.5 font-mono text-[11px] font-medium tracking-[0.08em] text-ink-soft no-underline transition-colors hover:border-brand hover:text-brand"
    >
      {next}
    </Link>
  )
}

function ProjectsMenu({ lang }: { lang: Lang }) {
  const { t, path, project } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-sm font-medium transition-colors',
          open ? 'text-ink' : 'text-ink-soft hover:text-ink',
        )}
      >
        {t.nav.projects}
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div
          role="menu"
          aria-label={t.nav.projects}
          className="absolute right-0 top-full z-50 mt-2 w-[22rem] rounded-xl border border-rule bg-surface p-2 shadow-plate"
        >
          <Link
            role="menuitem"
            to={path('/collections/olist')}
            className="flex gap-3 rounded-lg px-3 py-2.5 no-underline transition-colors hover:bg-surface-2"
          >
            <span className="mt-0.5 font-mono text-[10px] text-muted">01</span>
            <span>
              <span className="block text-sm font-semibold text-ink">{t.nav.collection}</span>
              <span className="mt-0.5 block text-xs leading-snug text-muted">
                {t.collection.title}
              </span>
            </span>
          </Link>
          <div className="my-1 border-t border-rule" />
          {projectOrder.map((slug) => {
            const item = t.projects[slug]
            return (
              <Link
                key={slug}
                role="menuitem"
                to={project(slug)}
                className="flex gap-3 rounded-lg px-3 py-2.5 no-underline transition-colors hover:bg-surface-2"
              >
                <span className="mt-0.5 font-mono text-[10px] text-muted">{item.kicker.split('·')[0].trim()}</span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{item.title}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-muted">{item.question}</span>
                </span>
              </Link>
            )
          })}
          <Link
            role="menuitem"
            to={`${lang === 'pt' ? '/pt' : ''}/#projects`}
            className="mt-1 block rounded-lg border-t border-rule px-3 pb-1 pt-2.5 text-xs font-semibold text-brand no-underline hover:underline"
          >
            {t.nav.allProjects}
          </Link>
        </div>
      ) : null}
    </div>
  )
}

export function Header() {
  const { lang, t, path } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setMobileOpen(false), [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper backdrop-blur">
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to={path('/')} className="group flex items-baseline gap-2.5 no-underline">
          <span className="font-display text-base font-semibold sm:text-[1.15rem] tracking-[-0.01em] text-ink">
            Applied Data Science
          </span>
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-muted sm:inline">
            Anderson Tavares
          </span>
        </Link>

        <nav aria-label={t.nav.projects} className="hidden items-center gap-1 md:flex">
          <NavLink
            to={path('/')}
            end
            className={({ isActive }) =>
              cn(
                'inline-flex h-9 items-center rounded-md px-2.5 text-sm font-medium no-underline transition-colors',
                isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
              )
            }
          >
            {t.nav.home}
          </NavLink>
          <ProjectsMenu lang={lang} />
          <NavLink
            to={path('/about')}
            className={({ isActive }) =>
              cn(
                'inline-flex h-9 items-center rounded-md px-2.5 text-sm font-medium no-underline transition-colors',
                isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
              )
            }
          >
            {t.nav.about}
          </NavLink>
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSwitch lang={lang} />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? t.nav.close : t.nav.menu}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-rule bg-paper px-4 pb-10 pt-5 md:hidden"
        >
          <nav aria-label={t.nav.menu} className="mx-auto flex max-w-site flex-col gap-1">
            <Link
              to={path('/')}
              className="rounded-lg px-3 py-3 text-base font-semibold text-ink no-underline hover:bg-surface-2"
            >
              {t.nav.home}
            </Link>
            <Link
              to={path('/collections/olist')}
              className="rounded-lg px-3 py-3 no-underline hover:bg-surface-2"
            >
              <span className="block font-mono text-[10px] text-muted">01</span>
              <span className="mt-0.5 block text-sm font-semibold text-ink">{t.nav.collection}</span>
              <span className="mt-0.5 block text-xs text-muted">{t.collection.title}</span>
            </Link>
            <p className="px-3 pb-1 pt-4 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
              {t.nav.projects}
            </p>
            {projectOrder.map((slug) => {
              const item = t.projects[slug]
              return (
                <Link
                  key={slug}
                  to={path(`/projects/${slug}`)}
                  className="rounded-lg px-3 py-3 no-underline hover:bg-surface-2"
                >
                  <span className="block font-mono text-[10px] text-muted">{item.kicker.split('·')[0].trim()}</span>
                  <span className="mt-0.5 block text-sm font-semibold text-ink">{item.title}</span>
                </Link>
              )
            })}
            <Link
              to={path('/#projects')}
              className="px-3 py-2 text-xs font-semibold text-brand no-underline hover:underline"
            >
              {t.nav.allProjects}
            </Link>
            <Link
              to={path('/about')}
              className="mt-3 rounded-lg border-t border-rule px-3 py-3 text-base font-semibold text-ink no-underline hover:bg-surface-2"
            >
              {t.nav.about}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
