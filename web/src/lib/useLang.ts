import { useLocation } from 'react-router-dom'
import { content, getLang, localize, projectPath, switchLanguagePath } from '../content'
import type { Lang, Slug } from '../content/types'

export function useLang(): {
  lang: Lang
  t: (typeof content)[Lang]
  switchTo: string
  path: (path: string) => string
  project: (slug: Slug) => string
} {
  const { pathname } = useLocation()
  const lang = getLang(pathname)
  return {
    lang,
    t: content[lang],
    switchTo: switchLanguagePath(pathname),
    path: (path: string) => localize(lang, path),
    project: (slug: Slug) => projectPath(lang, slug),
  }
}
