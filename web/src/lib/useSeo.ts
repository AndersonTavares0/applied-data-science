import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import type { Lang } from '../content/types'

const SITE = 'https://AndersonTavares0.github.io/applied-data-science'

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export function useSeo(title: string, description: string, lang: Lang) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:locale', lang === 'pt' ? 'pt_BR' : 'en_US')

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${SITE}${pathname === '/' ? '/' : pathname}`
  }, [title, description, lang, pathname])
}
