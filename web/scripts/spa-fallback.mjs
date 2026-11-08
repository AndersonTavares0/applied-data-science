// GitHub Pages has no server-side rewrites. Emit the built shell at every
// public route so direct links return 200 with route-specific metadata, and
// keep 404.html for unknown paths (BrowserRouter renders the in-app not-found).
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const dist = resolve(import.meta.dirname, '..', 'dist')
const index = resolve(dist, 'index.html')
const fallback = resolve(dist, '404.html')
const site = 'https://andersontavares0.github.io/ds-portfolio'

const routes = [
  {
    path: '',
    title: 'Anderson Tavares — E-commerce Operations & Customer Experience',
    description:
      'Late delivery is the strongest signal of customer dissatisfaction in this marketplace. Measured across 99,441 Olist orders, predicted honestly, and explained through 9,139 written complaints.',
    lang: 'en',
  },
  {
    path: 'pt',
    title: 'Anderson Tavares — Operações de E-commerce e Experiência do Cliente',
    description:
      'O atraso na entrega é o sinal mais forte de insatisfação do cliente neste marketplace. Medido em 99.441 pedidos da Olist, previsto com honestidade e explicado por 9.139 reclamações escritas.',
    lang: 'pt-BR',
  },
  {
    path: 'projects/retail-analytics',
    title: 'E-commerce Performance & Fulfillment Analytics — Anderson Tavares',
    description:
      'A dbt and PostgreSQL analysis of 99,441 Olist orders: acquisition rather than retention, a promise that is conservative almost everywhere, and lateness concentrated on one crossing.',
    lang: 'en',
  },
  {
    path: 'pt/projects/retail-analytics',
    title: 'Análise de Desempenho e Cumprimento de Pedidos em E-commerce — Anderson Tavares',
    description:
      'Uma análise em dbt e PostgreSQL de 99.441 pedidos da Olist: aquisição em vez de retenção, um prazo conservador em quase todo o país e atraso concentrado em um corredor.',
    lang: 'pt-BR',
  },
  {
    path: 'projects/late-delivery',
    title: 'Late-Delivery Risk Prediction & Temporal Validation — Anderson Tavares',
    description:
      'A temporal-holdout model of late delivery using only checkout-time information. The honest result is a modest ranking signal, not a production queue.',
    lang: 'en',
  },
  {
    path: 'pt/projects/late-delivery',
    title: 'Previsão de Risco de Atraso e Validação Temporal — Anderson Tavares',
    description:
      'Um modelo de atraso com amostra temporal usando apenas informações do checkout. O resultado honesto é um sinal modesto de ordenação, não uma fila de produção.',
    lang: 'pt-BR',
  },
  {
    path: 'projects/voice-of-customer',
    title: 'Customer Complaint Topic Modeling & Comparative Analysis — Anderson Tavares',
    description:
      'A topic model of Portuguese complaint text. Late and on-time customers complain about different things: the parcel and the product. Selection and topic stability are stated first.',
    lang: 'en',
  },
  {
    path: 'pt/projects/voice-of-customer',
    title: 'Modelagem de Tópicos de Reclamações e Análise Comparativa — Anderson Tavares',
    description:
      'Um modelo de tópicos sobre reclamações em português. Clientes com atraso e no prazo reclamam de coisas diferentes: o pacote e o produto. Seleção e estabilidade vêm antes.',
    lang: 'pt-BR',
  },
  {
    path: 'about',
    title: 'About Anderson Tavares — E-commerce Operations & Customer Experience',
    description:
      'How the three Olist case studies were built: reproducible SQL and dbt models, temporal validation, text analysis, and an explicit account of what the data cannot support.',
    lang: 'en',
  },
  {
    path: 'pt/about',
    title: 'Sobre Anderson Tavares — Operações de E-commerce e Experiência do Cliente',
    description:
      'Como os três estudos da Olist foram construídos: SQL e modelos dbt reproduzíveis, validação temporal, análise de texto e uma explicação explícita do que os dados não sustentam.',
    lang: 'pt-BR',
  },
]

if (!existsSync(index)) {
  console.error('spa-fallback: dist/index.html is missing; run vite build first')
  process.exit(1)
}

const shell = readFileSync(index, 'utf8')

function withMetadata(html, route) {
  const url = `${site}/${route.path}${route.path ? '/' : ''}`
  return html
    .replace(/<html lang="[^"]*"/, `<html lang="${route.lang}"`)
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${route.description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${route.title}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${route.description}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${route.title}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${route.description}$2`)
}

copyFileSync(index, fallback)
for (const route of routes) {
  const destination =
    route.path === '' ? index : resolve(dist, route.path, 'index.html')
  mkdirSync(dirname(destination), { recursive: true })
  writeFileSync(destination, withMetadata(shell, route))
}
console.log(`spa-fallback: wrote dist/404.html and ${routes.length} route shells`)
