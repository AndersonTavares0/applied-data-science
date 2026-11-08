export type Lang = 'en' | 'pt'

export type Slug = 'retail-analytics' | 'late-delivery' | 'voice-of-customer'

export type SectionId =
  | 'question'
  | 'why'
  | 'data'
  | 'method'
  | 'findings'
  | 'implications'
  | 'limitations'
  | 'reproduction'

export interface ChartCopy {
  title: string
  subtitle: string
  note: string
  description: string
}

export interface Metric {
  value: string
  label: string
  note: string
}

export interface ProjectSummary {
  slug: Slug
  number: string
  title: string
  question: string
  headline: string
  headlineNote: string
  method: string
  tags: string[]
  cta: string
}

export interface ProjectContent {
  metaTitle: string
  metaDescription: string
  kicker: string
  title: string
  deck: string
  heroStats: Metric[]
  sectionLabels: Record<SectionId, string>
  tocTitle: string
  question: string[]
  why: string[]
  data: string[]
  method: { intro: string[]; steps: string[] }
  findings: { intro: string[]; bullets: string[]; outro: string[] }
  implications: { intro: string[]; items: { title: string; body: string }[] }
  limitations: string[]
  reproduction: { intro: string; commands: string[]; note: string }
  charts: Record<string, ChartCopy>
}

export interface HomeContent {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  title: string
  lead: string
  thesis: string
  primaryCta: string
  secondaryCta: string
  heroPlate: {
    label: string
    lateLabel: string
    lateValue: string
    onTimeLabel: string
    onTimeValue: string
    footnote: string
  }
  projectsHeading: string
  projectsIntro: string
  projects: ProjectSummary[]
  work: {
    heading: string
    intro: string
    items: { icon: string; title: string; body: string }[]
  }
  credibility: { value: string; label: string }[]
  closing: { heading: string; body: string; cta: string }
}

export interface AboutContent {
  metaTitle: string
  metaDescription: string
  title: string
  intro: string[]
  lookingFor: string
  toolsHeading: string
  tools: { area: string; items: string }[]
  principlesHeading: string
  principles: { title: string; body: string }[]
  contactHeading: string
  contactNote: string
  links: { label: string; value: string; href: string }[]
  note: string
}

export interface NavContent {
  skip: string
  home: string
  projects: string
  about: string
  allProjects: string
  menu: string
  close: string
  language: string
  switchLanguage: string
  themeLight: string
  themeDark: string
  onThisPage: string
  backToProjects: string
  projectNav: string
  nextProject: string
  previousProject: string
  source: string
  sourceNote: string
  dataLicence: string
  builtWith: string
  contact: string
  notFoundTitle: string
  notFoundBody: string
  notFoundCta: string
}

export interface SiteContent {
  lang: Lang
  htmlLang: string
  nav: NavContent
  home: HomeContent
  projects: Record<Slug, ProjectContent>
  about: AboutContent
  footer: {
    line: string
    source: string
    licence: string
    note: string
  }
  common: {
    figure: string
    sourceLabel: string
    definition: string
    readCase: string
    published: string
    methodLabel: string
    limitationLabel: string
    openSource: string
    backHome: string
  }
}
