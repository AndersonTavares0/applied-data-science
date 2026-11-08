import { en } from './en'
import { pt } from './pt'
import type { Lang, SiteContent, Slug } from './types'

export const content: Record<Lang, SiteContent> = { en, pt }

export function getLang(pathname: string): Lang {
  return pathname === '/pt' || pathname.startsWith('/pt/') ? 'pt' : 'en'
}

export function localize(lang: Lang, path: string): string {
  if (lang === 'en') return path
  if (path === '/') return '/pt/'
  return `/pt${path}`
}

export function switchLanguagePath(pathname: string): string {
  if (pathname === '/pt' || pathname === '/pt/') return '/'
  if (pathname.startsWith('/pt/')) return pathname.slice(3) || '/'
  return pathname === '/' ? '/pt/' : `/pt${pathname}`
}

export function projectPath(lang: Lang, slug: Slug): string {
  return localize(lang, `/projects/${slug}`)
}

export const projectOrder: Slug[] = ['retail-analytics', 'late-delivery', 'voice-of-customer']
