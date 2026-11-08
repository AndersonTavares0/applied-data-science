import type { SiteContent } from './types'

export const pt: SiteContent = {
  lang: 'pt',
  htmlLang: 'pt-BR',
  nav: {
    skip: 'Pular para o conteúdo',
    home: 'Início',
    projects: 'Estudos',
    collection: 'Coleção Olist',
    about: 'Sobre',
    allProjects: 'Todos os estudos',
    menu: 'Menu',
    close: 'Fechar menu',
    language: 'Idioma',
    switchLanguage: 'View in English',
    themeLight: 'Mudar para o tema claro',
    themeDark: 'Mudar para o tema escuro',
    onThisPage: 'Nesta página',
    backToProjects: 'Voltar aos estudos',
    projectNav: 'Navegação dos estudos',
    nextProject: 'Próximo estudo',
    previousProject: 'Estudo anterior',
    source: 'Fonte',
    sourceNote: 'Todo número é reproduzível a partir do SQL e dos scripts versionados.',
    dataLicence: 'Dados: Olist, CC BY-NC-SA 4.0',
    builtWith: 'Feito com React, TypeScript, Tailwind e Recharts',
    contact: 'Contato',
    notFoundTitle: 'Esta página não existe.',
    notFoundBody: 'O link pode estar antigo, ou a página pode ter mudado. Os três estudos de caso continuam aqui.',
    notFoundCta: 'Ir para a página inicial',
  },
  collection: {
    metaTitle: 'Operações de E-commerce e Experiência do Cliente — Applied Data Science',
    metaDescription:
      'A primeira coleção do Applied Data Science: 99.441 pedidos da Olist e três estudos conectados de medição, previsão e texto de reclamações, cada um com suas limitações declaradas.',
    eyebrow: 'Coleção 01 · Operações de e-commerce Olist',
    title: 'Operações de E-commerce e Experiência do Cliente',
    subtitle: 'Um estudo reproduzível em ciência de dados',
    lead:
      'Um marketplace brasileiro, 99.441 pedidos entre setembro de 2016 e outubro de 2018, e três estudos que perguntam o que aconteceu, o que pode ser ordenado no checkout e o que os clientes escreveram quando o pacote deu errado.',
    stats: [
      { value: '99.441', label: 'pedidos analisados', note: 'setembro de 2016 – outubro de 2018' },
      { value: 'R$ 16,0 mi', label: 'valor de pagamento registrado', note: 'Registros de pagamento, não receita realizada' },
      { value: '6,77%', label: 'das entregas chegam atrasadas', note: '6.535 de 96.476 pedidos entregues' },
      { value: '9.139', label: 'reclamações escritas lidas', note: 'avaliações de 1–2 estrelas de pedidos entregues' },
    ],
    scope: {
      heading: 'O conjunto de dados e seu escopo',
      paragraphs: [
        'A coleção é construída sobre o conjunto Olist de e-commerce brasileiro: nove tabelas relacionadas com pedidos, itens, pagamentos, avaliações, produtos, vendedores, clientes, geolocalização e tradução de categorias. Todo número publicado vem de modelos em PostgreSQL e dbt que são testados antes de chegar a um gráfico.',
        'Os três estudos compartilham um grão e uma janela temporal. O estudo 01 mede receita, retenção e desfechos de entrega. O estudo 02 aprende apenas com características disponíveis no checkout e valida em pedidos feitos depois do corte. O estudo 03 lê as reclamações escritas de pedidos entregues e compara atrasados com pontuais.',
        'A janela termina em 17 de outubro de 2018, então os dois últimos meses são parciais. Não há dado de reembolso, custo, margem ou identificador de transportadora, e as avaliações são auto-selecionadas. Esses limites aparecem em cada estudo, não ficam guardados aqui.',
      ],
    },
    studiesHeading: 'Três estudos, um fio',
    studiesIntro:
      'Cada estudo declara a pergunta, o escopo, o método, o resultado e o que os dados não sustentam. Leia na ordem ou comece pela pergunta mais próxima do seu trabalho.',
    method: {
      heading: 'Reprodutível desde o arquivo bruto',
      intro:
        'Nada neste site é digitado à mão a partir de um notebook. O caminho do download com revisão fixada até o número na página é scriptado e testado.',
      steps: [
        'Os CSVs brutos são baixados de uma revisão fixada e carregados como texto. Conversões, renomeações e tratamento de células vazias acontecem só no staging do dbt.',
        'Cada mart tem descrição e chaves testadas. O dbt build roda 91 testes de dados, incluindo retenção no mês zero e concordância entre o flag de atraso e os dias de atraso.',
        'O Python lê os marts testados para o modelo e para a análise de reclamações. O site consome exportações JSON versionadas, então o frontend nunca consulta um banco.',
        'Um único task runner reconstrói o pipeline. 54 testes em Python cobrem o contrato de features, a divisão temporal, as métricas e a normalização de texto sem rede nem banco.',
      ],
      note:
        'O conjunto tem cerca de 126 MB e não é versionado. O código é MIT; os dados são CC BY-NC-SA 4.0 e permanecem com a Olist.',
    },
    limitations: {
      heading: 'O que esta coleção não estabelece',
      intro:
        'A coleção localiza um problema e o mede. Ela não o explica, não o precifica e não prova que mudar uma variável mudaria o desfecho.',
      items: [
        'Nenhuma afirmação causal sobre atraso. O corredor entre São Paulo e Rio é onde o atraso se concentra, mas os dados não têm transportadora, transferência ou atribuição de rota. O comportamento dos vendedores não está descartado.',
        'Nenhuma receita realizada. O valor de pagamento registrado é o valor bruto da tabela de pagamentos, incluindo frete e pedidos cancelados que ainda têm registro de pagamento.',
        'Nenhuma população de clientes. O corpus de reclamações é selecionado pelo desfecho e por quem escolheu escrever; avaliações positivas não são modeladas.',
        'Nenhum segundo marketplace ou período posterior. O vocabulário, o prazo e a operação de entrega pertencem à Olist entre setembro de 2016 e outubro de 2018.',
        'Nenhuma recomendação de implantação. O estudo 02 é um caso sobre vazamento e avaliação honesta, não uma fila de produção.',
      ],
    },
    cta: {
      primary: 'Começar pela análise de operações',
      secondary: 'Ler sobre o método',
    },
  },
  home: {
    metaTitle: 'Applied Data Science — Anderson Tavares',
    metaDescription:
      'O atraso na entrega é o sinal mais forte de insatisfação do cliente neste marketplace. Medido em 99.441 pedidos, previsto com honestidade e explicado por 9.139 reclamações escritas.',
    eyebrow: 'Applied Data Science · Anderson Tavares',
    subtitle: 'Um estudo reproduzível em ciência de dados',
    title: 'O atraso na entrega é o sinal mais forte de insatisfação do cliente.',
    lead:
      'Eu medi isso em 99.441 pedidos da Olist. Depois fiz as duas perguntas que vêm a seguir: um modelo consegue ver o risco no checkout, e o que os clientes realmente escrevem quando o pacote dá errado?',
    thesis:
      'A primeira coleção traz um conjunto de dados e três perguntas: quais alavancas movem satisfação e recompra, é possível ordenar atrasos com honestidade, e do que falam as reclamações nas palavras dos próprios clientes?',
    primaryCta: 'Ler a análise de operações',
    secondaryCta: 'Ver os três estudos',
    collectionCard: {
      eyebrow: 'Primeira coleção · Operações de e-commerce Olist',
      title: 'Operações de E-commerce e Experiência do Cliente',
      subtitle: 'Um estudo reproduzível em ciência de dados',
      body:
        'Applied Data Science reúne estudos reproduzíveis sobre dados operacionais reais. A primeira coleção acompanha 99.441 pedidos da Olist entre medição, previsão e as palavras dos próprios clientes.',
      cta: 'Explorar a coleção',
    },
    heroPlate: {
      label: 'A descoberta, em dois números',
      lateLabel: 'Entrega atrasada',
      lateValue: '2,27',
      onTimeLabel: 'No prazo',
      onTimeValue: '4,29',
      footnote:
        'Nota média da avaliação. 6.535 de 96.476 entregas — 6,77% — chegaram depois da data prometida. É uma associação, não um efeito causal.',
    },
    projectsHeading: 'Três estudos, um fio',
    projectsIntro:
      'Cada estudo de caso declara a pergunta, o escopo, o método, o resultado e o que os dados não sustentam. As limitações fazem parte do argumento, não são uma nota de rodapé.',
    projects: [
      {
        slug: 'retail-analytics',
        number: '01',
        title: 'Análise de Desempenho e Cumprimento de Pedidos em E-commerce',
        question: 'Quais alavancas realmente movem a satisfação do cliente e a recompra?',
        headline: 'R$ 16,0 mi de valor de pagamento registrado. 96,9% dos clientes compram uma única vez.',
        headlineNote:
          'O atraso se concentra no corredor São Paulo → Rio: 14,17% de atraso, contra 4,49% dentro de São Paulo. O padrão é associativo; os dados não identificam a transportadora nem a causa.',
        method: 'PostgreSQL · dbt · SQL · Python',
        tags: ['dbt', 'PostgreSQL', 'coortes', 'entrega'],
        cta: 'Ler o estudo de caso',
      },
      {
        slug: 'late-delivery',
        number: '02',
        title: 'Previsão de Risco de Atraso e Validação Temporal',
        question: 'No momento da compra, é possível ordenar os pedidos pelo risco de atrasar?',
        headline: 'AUC 0,685. Os 10% de maior risco concentram 19,7% dos atrasos.',
        headlineNote:
          'Isso é 1,97× a taxa base — um sinal de ranking modesto, não uma fila pronta para produção. Os 5% do topo são menos precisos que os 10%.',
        method: 'Python · pandas · scikit-learn',
        tags: ['amostra temporal', 'calibração', 'capacidade', 'no-go'],
        cta: 'Ler o estudo de caso',
      },
      {
        slug: 'voice-of-customer',
        number: '03',
        title: 'Modelagem de Tópicos de Reclamações e Análise Comparativa',
        question: 'Do que falam 9.139 reclamações escritas, e como os pedidos atrasados diferem?',
        headline: 'Reclamações de atrasados são sobre o pacote: 65,7% contra 18,5%.',
        headlineNote:
          'Reclamações de pedidos no prazo são sobre o produto: 68,9% contra 18,1%. O corpus é selecionado pelo desfecho, e o relatório declara isso antes do resultado.',
        method: 'Python · PLN · modelagem de tópicos com LDA',
        tags: ['LDA', 'composicional', 'seleção', 'auditoria'],
        cta: 'Ler o estudo de caso',
      },
    ],
    work: {
      heading: 'Como eu trabalho',
      intro: 'A análise vale o que vale o caminho do arquivo bruto até o número na página.',
      items: [
        {
          icon: 'pipeline',
          title: 'Reprodutível por padrão',
          body:
            'Os CSVs brutos ficam como texto, as conversões acontecem no staging do dbt e cada mart é testado. Um comando reconstrói a análise a partir de um download com revisão fixada.',
        },
        {
          icon: 'clock',
          title: 'Validação temporal',
          body:
            'O modelo treina apenas com rótulos maduros antes do corte. A divisão ingênua removia 3.852 pedidos em trânsito com 39,1% de atraso.',
        },
        {
          icon: 'uncertainty',
          title: 'Incerteza no número',
          body:
            'Intervalos de bootstrap, intervalos de confiança e refits com outras sementes acompanham a estimativa. Um ponto isolado não é um resultado.',
        },
        {
          icon: 'limits',
          title: 'Limitações antes das recomendações',
          body:
            'Sem identificador de transportadora, sem modelo de custo, um recorte de 25 meses. Dizer isso faz parte da descoberta, não é uma ressalva no fim.',
        },
      ],
    },
    credibility: [
      { value: '99.441', label: 'pedidos analisados' },
      { value: 'PostgreSQL + dbt', label: 'pipeline testado' },
      { value: '91', label: 'testes de dados no dbt' },
      { value: '54', label: 'testes em Python' },
      { value: 'EN / PT', label: 'todas as páginas traduzidas' },
    ],
    closing: {
      heading: 'Medir é a parte fácil. Decidir o que o número significa é o trabalho.',
      body:
        'Se você está contratando para posições de analista ou cientista de dados, o método e as ressalvas são a parte que eu mais gostaria de discutir.',
      cta: 'Sobre e contato',
    },
  },
  projects: {
    'retail-analytics': {
      metaTitle: 'Análise de Desempenho e Cumprimento de Pedidos em E-commerce — Anderson Tavares',
      metaDescription:
        '99.441 pedidos da Olist em PostgreSQL e dbt: R$ 16,0 mi de valor de pagamento registrado, recompra de 3,12% e um problema de atraso concentrado no corredor São Paulo → Rio.',
      kicker: 'Projeto 01 · Análise de Desempenho e Cumprimento de Pedidos em E-commerce',
      title: 'Análise de Desempenho e Cumprimento de Pedidos em E-commerce',
      deck:
        'Uma análise de 99.441 pedidos em dbt e PostgreSQL. A descoberta incômoda é que este é um negócio de aquisição, e que o atraso se concentra em um corredor, sem que a qualidade dos vendedores o explique.',
      heroStats: [
        { value: 'R$ 16,0 mi', label: 'de valor de pagamento registrado em 25 meses', note: 'Ticket médio de R$ 160,99; o frete é 14,1% disso. É valor pago, não receita realizada após reembolsos.' },
        { value: '96,9%', label: 'dos clientes compram uma vez', note: '3,12% compram de novo alguma vez; 0,48% no mês calendário seguinte.' },
        { value: '6,77%', label: 'das entregas atrasam', note: 'Pedidos atrasados têm média de 2,27 estrelas contra 4,29 no prazo.' },
      ],
      sectionLabels: {
        question: 'A pergunta',
        why: 'Por que importa',
        data: 'Dados e escopo',
        method: 'Método',
        findings: 'O que os dados mostram',
        implications: 'O que eu faria',
        limitations: 'Limitações',
        reproduction: 'Reproduzir',
      },
      tocTitle: 'Nesta página',
      question: [
        'A pergunta era quais alavancas realmente movem a satisfação do cliente e a recompra, e não o que aconteceu. O marketplace tinha 99.441 pedidos e uma nota de avaliação para quase todos. As alavancas óbvias — marketing, fidelidade, descontos, qualidade do vendedor — precisavam ser separadas daquela para a qual os dados insistiam em apontar.',
        'Três descobertas saíram disso. O valor de pagamento registrado cresce por aquisição, não por retenção. A data prometida é conservadora em quase todo lugar. E a minoria de entregas atrasadas não se distribui igualmente pelo país: concentra-se em uma única travessia.',
      ],
      why: [
        'Se 96,9% dos clientes nunca fazem um segundo pedido, um programa de fidelidade gastaria dinheiro para influenciar uma decisão que quase ninguém está tomando. A pergunta de crescimento passa a ser como adquirir mais clientes ou elevar o valor por visita. É um modelo operacional diferente do que um painel de retenção sugere.',
        'A descoberta sobre entrega importa por um segundo motivo: é a relação mais forte do conjunto de dados. Um pedido atrasado tem média de 2,27 estrelas; um pedido no prazo tem 4,29. As condições associadas ao atraso também respondem por boa parte da insatisfação que o marketplace consegue medir.',
      ],
      data: [
        'O conjunto é o Olist Brazilian e-commerce dataset: 99.441 pedidos feitos entre setembro de 2016 e outubro de 2018, em nove tabelas relacionadas — pedidos, itens, pagamentos, avaliações, produtos, vendedores, clientes, geolocalização e tradução de categorias.',
        'A análise cobre 96.476 entregas com data de entrega observada. Pedidos sem essa data ficam em grupos separados em vez de imputados: cancelado ou indisponível, em aberto no snapshot e oito pedidos entregues sem data. Eles não são um único desfecho.',
        'Dois limites de escopo moldam todos os números. O recorte termina em 17 de outubro de 2018, então setembro e outubro de 2018 são meses parciais. As avaliações são autosselecionadas: só aparecem clientes que escolheram escrever, e a satisfação deles não é a da população. Não há dados de custo, margem, reembolso ou transportadora.',
      ],
      method: {
        intro: [
          'Todo número vem de um modelo testado em projects/01-retail-analytics/dbt_project. Os CSVs brutos entram no PostgreSQL com todas as colunas como texto; a conversão e o renomeio acontecem no staging do dbt, por macros que tratam uma célula vazia como NULL.',
        ],
        steps: [
          'Agregar três tabelas mais granulares antes de juntá-las. Itens, pagamentos e avaliações são mais granulares que um pedido; um join direto multiplica linhas e nada falha. Um pedido com quatro itens e três pagamentos contaria doze vezes.',
          'Construir marts para receita mensal, receita por categoria, desfechos de entrega, atraso por estado, atraso por corredor, retenção por coorte e RFM. Cada chave é testada com unique e not_null; as chaves estrangeiras usam testes de relationships.',
          'Medir o atraso em dias inteiros. A data prometida é meia-noite nos 99.441 pedidos, enquanto a data de entrega carrega horário. Comparar até o segundo classificava 1.292 pedidos errado.',
          'Rodar 91 testes de dados no dbt build, incluindo retenção do mês zero igual a 100%, concordância entre o flag de atraso e os dias de atraso, e a regra de que um prazo maior nunca pode tornar mais pedidos atrasados.',
        ],
      },
      findings: {
        intro: [
          'O valor de pagamento registrado foi de R$ 16.008.872,12 em 99.441 pedidos, média de R$ 160,99. O frete é R$ 2,25 mi, ou 14,1% do que os clientes pagaram. Novembro de 2017 é o maior mês, com R$ 1,19 mi e 7.544 pedidos, 63% acima de outubro — consistente com a Black Friday.',
        ],
        bullets: [
          'Este é um negócio de aquisição. 93.099 dos 96.096 clientes fizeram exatamente um pedido (96,88%). 2.997 fizeram um segundo alguma vez, taxa de recompra de 3,12%. Clientes de um pedido respondem por 94,1% do valor de pagamento registrado; os de recompra, por 5,9%.',
          'Comprar de novo no mês calendário seguinte é 0,48%, e a retenção fica perto de 0,2% depois disso. Ela não cai de uma base alta; começa baixa. O deslocamento é um mês calendário, não uma janela de 30 dias, e a janela de 25 meses trunca quem voltaria mais tarde. O número é um piso.',
          'O RFM é reportado, mas é fraco. A frequência quase não varia quando 96,9% dos clientes compram uma vez, então o score de frequência é a contagem limitada a cinco, não um quintil. “Champions” significa comprou recentemente, gastou bem e voltou ao menos uma vez — 1.066 clientes, não um grande segmento fiel.',
          '6.535 de 96.476 entregas chegaram depois da data prometida, 6,77%. Pedidos atrasados têm média de 2,27 estrelas contra 4,29 no prazo. Depois de uma semana de atraso, cerca de 80% dos avaliadores dão uma ou duas estrelas, contra 9,27% no prazo.',
          'São Paulo atrasa em 4,49% de 40.495 entregas. O Rio de Janeiro atrasa em 12,10% de 12.353; a Bahia em 12,16%; o Ceará em 13,76%. O pedido entregue médio chega 11,88 dias antes, então a promessa é conservadora em quase todo lugar.',
          'O comportamento dos vendedores não explica a diferença. Eles despacham em cerca de três dias nos corredores com volume. Um vendedor do Rio entregando dentro do Rio atrasa 4,76% das vezes, próximo dos 4,66% de São Paulo, e 53 dos 65 vendedores que enviam para os dois estados vão pior para o Rio. Isso torna a qualidade do vendedor uma explicação improvável como causa única, mas não a descarta.',
          'O corredor é onde o problema se concentra. São Paulo → Rio carrega 8.129 das 12.353 entregas do Rio e atrasa 14,17%. Todo corredor interno com pelo menos 250 entregas fica em 4,8% ou menos. A mediana na travessia é 12,8 dias e o nonagésimo percentil é 31,0, então o problema está na cauda. É uma associação observada: o corredor indica onde investigar a transportadora e a transferência, não prova que a rota cause o atraso.',
          'São Paulo → Rio também tem a promessa mais curta: 27,0 dias, contra 30,3 no corredor mais distante São Paulo → Rio Grande do Sul, cuja mediana é 13,9 dias e o p90 é 27,1. Três dias a mais na promessa registrariam 11,60% em vez de 14,17%; sete a mais registrariam 8,37%.',
          'O valor dos itens por categoria soma R$ 13,59 mi contra R$ 16,0 mi de pagamentos porque conta apenas o preço do item. A diferença é frete, não erro. As dez maiores entre 74 categorias respondem por 62,4% do valor dos itens.',
          'O valor de pagamento registrado inclui pedidos cancelados e indisponíveis — 1.234 pedidos e R$ 269.735,11, cerca de 1,7% — porque houve pagamento registrado. Excluí-los seria uma definição diferente e igualmente defensável. O relatório declara qual está em uso.',
        ],
        outro: [
          'A estimativa do Rio é uma associação, não uma previsão causal. À taxa de São Paulo, cerca de 940 dos 1.495 pedidos atrasados do Rio ao longo dos 25 meses não teriam atrasado. Aplicando o comportamento observado de avaliação — 49,36% dos pedidos atrasados dão nota ≤2 contra 9,27% dos pedidos no prazo — isso implica cerca de 377 avaliações de uma e duas estrelas a menos no recorte. É cumulativo no período observado, não uma taxa anual.',
        ],
      },
      implications: {
        intro: [
          'A recomendação vem de onde o atraso se concentra, não do tamanho da diferença nas avaliações. O corredor é o primeiro lugar a investigar; isso não é uma conclusão sobre culpa dos vendedores.',
        ],
        items: [
          {
            title: 'Investigar o corredor São Paulo → Rio, não apenas a qualidade dos vendedores',
            body:
              'A travessia carrega dois terços dos pedidos do Rio com 14,17% de atraso. A pergunta para as transportadoras é por que o nonagésimo percentil é de 31 dias em um corredor cuja mediana é 12,8, e por que 379 pedidos chegam mais de duas semanas depois da promessa. Não existe identificador de transportadora, então isso exige o lado operacional, não outra consulta.',
          },
          {
            title: 'Depois recalibrar a promessa, corredor por corredor',
            body:
              'A promessa é uniforme onde o serviço não é. Três dias a mais registrariam 11,60% e sete a mais, 8,37%, enquanto o pacote médio chega 10,9 dias antes. Ampliar a promessa muda a medição, não o pacote, então isso pertence ao lado da pergunta operacional, não no lugar dela.',
          },
          {
            title: 'Testar o resultado de pacote não recebido antes de agir',
            body:
              'Pedidos cancelados ou indisponíveis têm nota 1,662, praticamente empatados com pedidos que chegam 8–14 dias atrasados, 1,672, enquanto pedidos em aberto no snapshot têm 1,796. A versão anterior juntava os três em “nunca entregue” e misturava reembolso com pacote em trânsito. Até o teste ser feito, é uma observação.',
          },
          {
            title: 'Alimentar o projeto de previsão',
            body:
              'Os grupos de entrega são o alvo natural do Projeto 02. A restrição já está clara: só entram atributos conhecidos no momento da compra, e os rótulos de treino precisam ter amadurecido antes do corte de teste.',
          },
        ],
      },
      limitations: [
        'O conjunto é um recorte de setembro de 2016 a outubro de 2018, não um feed ao vivo. Setembro e outubro de 2018 são parciais. Tudo aqui é uma observação de um período, não uma tendência.',
        'As avaliações são autosselecionadas. 98.673 de 99.441 pedidos têm avaliação, mas só aparecem clientes que escolheram escrever. Uma média de 4,29 entre respondentes não é uma média de 4,29 entre todos os clientes.',
        '“Valor de pagamento registrado” significa o valor bruto registrado na tabela de pagamentos. Não há custo, margem, reembolso ou devolução, então nenhuma afirmação sobre lucro é possível — apenas sobre dinheiro arrecadado.',
        'O valor de pagamento registrado inclui 1.234 pedidos depois cancelados ou marcados como indisponíveis, R$ 269.735,11, porque houve pagamento registrado. Excluí-los seria uma definição diferente e igualmente defensável.',
        'customer_unique_id é derivado e imperfeito. As descobertas de recompra são um piso, não um teto; uma pessoa que muda os dados pode aparecer duas vezes.',
        'Contagens de pedidos e de itens têm grãos diferentes. Produtos e categorias vêm de fct_order_items; dinheiro, entrega e avaliações vêm de fct_orders. Misturar os dois é o caminho mais provável para um total errado.',
        'Um corredor é um par de estados, não uma rota medida. Os estados do vendedor e do cliente são a geografia mais fina do conjunto.',
        'O conjunto não tem identificador de transportadora. A descoberta do corredor diz onde o atraso se concentra; não identifica a transportadora nem a causa.',
        'Os números de corredor cobrem 96.411 das 96.476 entregas. Os 65 pedidos cujos itens vieram de vendedores em mais de um estado não têm corredor único.',
        'Onde falta data de entrega, 2.965 pedidos são excluídos das estatísticas de entrega em vez de imputados, e mantidos em grupos separados quando o tema é a experiência do cliente.',
      ],
      reproduction: {
        intro:
          'O pipeline é um comando a partir de um clone limpo. O download tem revisão fixada e é verificado por tamanho exato, então uma mudança na origem quebra o build em vez de mover um número publicado.',
        commands: [
          'uv run python tasks.py db-up',
          'uv run python tasks.py data',
          'uv run python tasks.py load',
          'uv run python tasks.py dbt-build',
          'uv run python tasks.py charts',
        ],
        note:
          'dbt build também roda 91 testes de dados. O relatório e os gráficos são versionados, então o site compila sem banco de dados.',
      },
      charts: {
        revenue: {
          title: 'Valor de pagamento registrado por mês',
          subtitle: 'Valor bruto de pagamentos; os meses de borda quase vazios ficam fora do gráfico',
          note: 'mart_revenue_monthly. Valor de pagamento registrado, não receita realizada. Excluídos: setembro de 2016 e setembro–outubro de 2018 (24 pedidos). Nenhum pedido em novembro de 2016; dezembro de 2016 tem um. As barras são meses, não uma série contínua.',
          description:
            'Gráfico de colunas do valor de pagamento registrado por mês, de outubro de 2016 a agosto de 2018. O valor sobe ao longo de 2017, atinge o pico em novembro de 2017 com R$ 1,19 mi e depois fica perto de R$ 1,0–1,16 mi em 2018.',
        },
        categories: {
          title: 'As categorias que sustentam o marketplace',
          subtitle: '12 maiores por valor dos itens; a participação é sobre todo o valor dos itens',
          note: 'mart_category_revenue. Os rótulos mostram valor dos itens, participação e preço médio do item. Frete não entra.',
          description:
            'Barras horizontais das doze categorias com mais valor dos itens, da maior para a menor. Saúde e beleza lidera com R$ 1,26 mi, seguida por relógios e presentes com R$ 1,21 mi e cama, mesa e banho com R$ 1,04 mi.',
        },
        delivery: {
          title: 'Nota média da avaliação por resultado da entrega',
          subtitle: 'Média da avaliação mais recente por pedido entregue; menor é pior',
          note: 'mart_delivery_performance. As barras mostram a nota média; o rótulo traz n e a participação de notas 2 ou menos.',
          description:
            'Barras horizontais da nota média por desfecho. Pedidos no prazo têm média 4,29 com 9,27% de notas baixas; as três faixas de atraso têm médias 2,72, 1,67 e 1,72; cancelados ou indisponíveis têm 1,66. A participação de uma e duas estrelas aparece em cada barra.',
        },
        states: {
          title: 'Atraso por estado do cliente',
          subtitle: 'Estados com ao menos 1.000 entregas; a linha tracejada é a taxa nacional',
          note: 'mart_late_delivery_by_state. Atraso significa entrega depois da data prometida. n é o número de pedidos entregues.',
          description:
            'Barras horizontais do percentual de atraso por estado, do pior para o melhor. Ceará tem 13,76%, Bahia 12,16% e Rio de Janeiro 12,10%; São Paulo tem 4,49% e aparece destacado. Cada barra traz seu número de entregas.',
        },
        lanes: {
          title: 'Atraso por rota vendedor → cliente',
          subtitle: 'As 12 piores rotas com ao menos 250 entregas, mais as rotas internas com volume',
          note: 'mart_late_delivery_by_lane. Barras azuis são rotas dentro do mesmo estado; a linha tracejada é a taxa nacional. Uma rota é um par de estados, não uma estrada.',
          description:
            'Barras horizontais do percentual de atraso por rota. São Paulo para Alagoas é a pior, com 23,92%, São Paulo para o Maranhão tem 18,98% e São Paulo para o Rio de Janeiro, 14,17% com 8.129 entregas. As seis rotas internas mostradas ficam em 4,76% ou menos.',
        },
        cohort: {
          title: 'Recompra por mês calendário',
          subtitle: 'Participação de clientes elegíveis que voltam; barras são retenção, a linha é a exposição',
          note: 'mart_cohort_retention. O deslocamento 1 significa o mês calendário seguinte, que pode ter 28–62 dias. Deslocamentos distantes usam só coortes antigas; a janela de 25 meses trunca a cauda.',
          description:
            'Barras de retenção por mês, começando em 0,48% no primeiro mês e ficando perto de 0,2%. Uma linha mostra os clientes elegíveis caindo de 96.095 no deslocamento um para 31.243 no deslocamento doze, conforme coortes mais novas saem.',
        },
        repeat: {
          title: 'Com que frequência o cliente volta',
          subtitle: 'Clientes em escala log; 5+ agrupa 5, 6, 7, 9 e 17 pedidos',
          note: 'mart_rfm. Um pedido por cliente é a maioria absoluta. As contagens são de clientes, não de pedidos.',
          description:
            'Gráfico de lollipop em escala horizontal logarítmica. 93.099 clientes fizeram um pedido (96,88%); 2.745 fizeram dois; 203 fizeram três; a cauda vai até um cliente com 17 pedidos.',
        },
        status: {
          title: 'O que o total de pagamentos inclui',
          subtitle: 'Valor de pagamento registrado por status do pedido, em escala log',
          note: 'fct_orders. Âmbar marca pedidos cancelados ou indisponíveis: houve pagamento, então eles permanecem no total. Receita realizada excluiria esses pedidos e eventuais reembolsos.',
          description:
            'Gráfico de lollipop do valor de pagamento registrado por status em escala logarítmica. Pedidos entregues somam R$ 15,42 mi; enviados R$ 177 mil; cancelados R$ 143 mil e indisponíveis R$ 126 mil, ambos destacados; os demais status são menores.',
        },
      },
    },
    'late-delivery': {
      metaTitle: 'Previsão de Risco de Atraso e Validação Temporal — Anderson Tavares',
      metaDescription:
        'Um modelo no checkout em 32.150 pedidos de uma amostra temporal: ROC AUC 0,685, lift de 1,97× no topo de 10%, inclinação de calibração 0,82 e um no-go honesto para produção.',
      kicker: 'Projeto 02 · Previsão de Risco de Atraso e Validação Temporal',
      title: 'Previsão de Risco de Atraso e Validação Temporal',
      deck:
        'Um classificador restrito ao que se sabe quando o pedido é feito, avaliado em uma amostra temporal. O resultado é um sinal de ranking modesto e um no-go claro para implantação.',
      heroStats: [
        { value: '32.150', label: 'pedidos na amostra temporal', note: '4,42% de atraso. Treino em 43.691 pedidos maduros com 5,61%.' },
        { value: '0,685', label: 'ROC AUC', note: 'Intervalo de bootstrap de 95%: 0,671–0,698.' },
        { value: '1,97×', label: 'lift no topo de 10%', note: 'Recall de 19,7% com precisão de 8,7%. Os 5% do topo são piores.' },
      ],
      sectionLabels: {
        question: 'A pergunta',
        why: 'Por que importa',
        data: 'Dados e escopo',
        method: 'Método',
        findings: 'O que o modelo faz',
        implications: 'O que eu faria',
        limitations: 'Limitações',
        reproduction: 'Reproduzir',
      },
      tocTitle: 'Nesta página',
      question: [
        'O Projeto 01 estabeleceu que o atraso na entrega é o sinal mais forte de insatisfação e que o atraso se concentra no corredor São Paulo → Rio. Este projeto faz a pergunta voltada ao futuro: no momento em que o pedido é feito, é possível ordenar os pedidos pelo risco de chegar atrasado?',
        'A resposta é sim, fracamente. O ranking é melhor que uma baseline por estado do cliente e pior que uma fila pronta para produção. A parte interessante não é a AUC; é a regra de seleção que fazia uma versão anterior parecer melhor do que era.',
      ],
      why: [
        'Um modelo que funciona no checkout pode agir antes de o pacote se mover. Ele poderia priorizar a entrega à transportadora, avisar o cliente ou reservar capacidade de atendimento. O valor depende inteiramente de o ranking ser preciso o bastante em uma capacidade que a operação consegue atender — e de o score ser estável entre períodos.',
        'A resposta honesta muda a decisão. Um lift de 1,97× no topo de 10% não justifica uma fila de produção sem modelo de custo e piloto prospectivo. O projeto é útil porque diz isso antes de alguém construir a fila.',
      ],
      data: [
        'O alvo é is_late: a data de entrega é estritamente posterior à data prometida. Pedidos sem data de entrega observada não têm rótulo e ficam fora. Isso não é o mesmo que “nunca entregue”: os 2.965 pedidos excluídos estão majoritariamente em trânsito ou cancelados no fim do conjunto (1.107 enviados, 619 cancelados, 609 indisponíveis e status menores).',
        'O treino usa compras antes de 2018-01-01 e entregas antes de 2018-04-01. O intervalo de três meses é o ponto. Uma regra ingênua — compra antes de abril, manter só entregues — descarta todo pedido ainda em trânsito em 1º de abril. Esses 3.852 pedidos não são aleatórios: 39,1% estavam atrasados. Removê-los faz o treino parecer mais fácil que a população que ele deve prever.',
        'Depois do intervalo, o treino maduro tem 43.691 pedidos com 5,61% de atraso. O teste são compras a partir de 2018-04-01 com rótulo observado: 32.150 pedidos com 4,42% de atraso. Janeiro–março de 2018 fica apenas como descrição retrospectiva, porque sua taxa de 12,89% reflete o backlog de fevereiro/março de 2018.',
      ],
      method: {
        intro: [
          'O contrato de atributos é uma lista de permissão, não de bloqueio: uma coluna nova no mart falha fechada até alguém adicioná-la de propósito. Só entra informação que existe quando o pedido é feito.',
        ],
        steps: [
          'Permitido: mês, dia da semana, hora e flag de fim de semana da compra; promise_days; estado do cliente e do vendedor, mais flag de mesmo estado; composição do pedido (categoria, contagens, valor dos itens, frete, valor do pedido, participação do frete, peso, volume, fotos, dimensões ausentes); número de pagamentos, parcelas e flags de método.',
          'Proibido: horário de aprovação, entrega à transportadora, data de entrega, duração, dias de atraso, o rótulo, nota da avaliação e status do pedido. O tempo de chegada preveria o atraso quase perfeitamente, e é por isso que incluí-lo tornaria a previsão inútil. Um teste unitário garante a exclusão.',
          'A seleção usa origem móvel em 2017-07-01, 2017-10-01 e 2018-01-01. Cada modelo é ajustado com rótulos maduros três meses antes da origem e avaliado nos três meses seguintes. A precisão média seleciona a regressão logística, 0,119 contra 0,108 do boosting.',
          'O modelo final é reajustado no treino maduro completo e avaliado uma vez na amostra de abril–agosto. Os dois modelos são reportados ali como checagem de sensibilidade, não para re-selecionar. As métricas são ROC AUC e precisão média para ranking, Brier e um resumo de calibração para probabilidades, e precisão/recall/lift em 5%, 10% e 20% de capacidade.',
        ],
      },
      findings: {
        intro: [
          'A regressão logística alcança ROC AUC 0,685 (intervalo de 95%: 0,671–0,698) e precisão média 0,082 (0,076–0,091) contra uma taxa base de 4,42%. O gradient boosting alcança AUC 0,679 e AP 0,087. A diferença pareada de bootstrap em AP é −0,0048 (−0,0122 a +0,0036); o intervalo inclui zero, então esta amostra não distingue os dois.',
        ],
        bullets: [
          'Com 10% de capacidade — 3.215 pedidos — o modelo encontra 280 atrasados: 8,7% de precisão, 19,7% de recall e 1,97× de lift. Os intervalos de bootstrap de 95% são 7,7–9,6% de precisão, 17,7–21,7% de recall e 1,77–2,17× de lift.',
          'A curva de capacidade não é monotônica. Com 5% de capacidade, 1.608 pedidos, a precisão é 7,7% e o recall 8,7%; com 20%, 6.430 pedidos, a precisão é 9,2% e o recall 41,8%. Os scores mais altos não são os mais puros, então o modelo não deve ser usado como uma lista curta estreita.',
          'Uma baseline por estado do cliente captura 12,2% dos atrasos com 10% de capacidade, 5,4% de precisão e 1,22× de lift. A precisão de 8,7% do modelo é melhor, mas o ganho é modesto.',
          'O nível agregado da probabilidade está próximo: previsão média de 4,26% contra 4,42% observados. Os decis não são uniformemente calibrados. As faixas intermediárias e médio-altas subestimam — o nono decil prevê 7,0% e observa 9,8% — enquanto o topo superestima, 12,3% contra 8,7%. A inclinação de calibração é 0,82, com intercepto −0,47. O score é um ranking, não uma probabilidade para um pedido individual.',
          'O sinal muda com o período. A AUC mensal vai de 0,60 a 0,79; o recall do decil superior cai para 10,4% em agosto. As origens móveis são mais fracas ainda: AUC 0,59–0,62 e precisão média 0,056–0,184 em três janelas.',
          'A importância por permutação coloca promise_days em primeiro (queda de 0,026 em AP), depois customer_state (0,017) e seller_state (0,003). Valor da cesta, frete, peso, pagamento e categoria acrescentam quase nada. purchase_month é ligeiramente negativa.',
          'A classe do modelo não está decidida. A regressão logística venceu a comparação com origens móveis; o boosting foi um pouco melhor na amostra final. Nenhum intervalo pareado exclui zero. Reportar um deles como “o modelo” exageraria o que esta divisão consegue decidir.',
        ],
        outro: [
          'A leitura prática é estreita. O score ordena uma fila de revisão melhor que a geografia sozinha, mas não o bastante para prometer um rendimento estável. Os 5% do topo serem menos precisos que os 10% é um aviso direto contra tratar os scores mais altos como uma lista curta precisa.',
        ],
      },
      implications: {
        intro: [
          'A recomendação é no-go para produção, com um caminho estreito para um piloto. A restrição não é o código; é a evidência.',
        ],
        items: [
          {
            title: 'Não implantar isto como fila de triagem ainda',
            body:
              'O lift é modesto, a curva de capacidade é irregular e não há modelo de custo. Um piloto prospectivo é defensável apenas se a operação conseguir medir a taxa de atraso dos pedidos revisados contra os não revisados, com capacidade e regra de decisão pré-registradas.',
          },
          {
            title: 'Não expor o score como probabilidade para o cliente',
            body:
              'A média está próxima, mas a inclinação é 0,82. Se uma probabilidade for necessária, recalibrar com pedidos entregues recentes e monitorar conforme o regime muda. Uma única amostra não estabelece estabilidade de calibração.',
          },
          {
            title: 'Monitorar e retreinar conforme os rótulos amadurecem',
            body:
              'Um sistema de produção retreinaria mensalmente conforme os desfechos chegam, não congelaria a janela de treino em um corte. Acompanharia a taxa de atraso, a distribuição de prazos e a mistura de estados, porque cada uma se moveu no período observado.',
          },
          {
            title: 'Manter a pergunta operacional em primeiro lugar',
            body:
              'O modelo confirma que o prazo e o par de estados vendedor–cliente carregam o sinal. Ele não diz que mudar o prazo causa um resultado melhor. A pergunta causal segue sendo a do corredor do Projeto 01.',
          },
        ],
      },
      limitations: [
        'O sinal é modesto. AUC 0,685 e lift de 1,97× no decil superior não bastam para justificar implantação sem modelo de custo e piloto prospectivo.',
        'Há uma única amostra e um regime em movimento. A AUC mensal vai de 0,60 a 0,79 e as origens móveis de 0,59 a 0,62. Uma decisão de produção precisa de avaliação móvel mais longa.',
        'Os pedidos excluídos não são uma amostra aleatória. 2.965 pedidos não têm rótulo de atraso observável; a maioria está em trânsito ou cancelada no fim do conjunto. O modelo nada diz sobre se um pedido cancelado teria atrasado.',
        'O intervalo de treino custa dados. Treinar antes de 2018-01-01 evita a seleção por velocidade de entrega, mas descarta o período com a maior taxa de atraso, janeiro–março de 2018.',
        'Sem identificador de transportadora ou armazém. O conjunto para em vendedor e estado, então a causa operacional mais plausível do atraso não está no modelo.',
        'O rótulo é a promessa, não a expectativa do cliente. Um pedido pode atrasar contra uma promessa agressiva e ainda chegar quando o cliente esperava.',
        'Pedidos com vários vendedores perdem a origem. 1.285 pedidos não têm um único estado de vendedor; a imputação os mantém na avaliação, mas enfraquece a geografia nessas linhas.',
        'A importância dos atributos é associacional. Embaralhar promise_days quebra sua correlação com a dificuldade do corredor, então a queda não é o efeito causal de mudar a promessa.',
        'Não há modelo de custo. O conjunto não tem custo de intervenção, valor de reembolso ou margem. A abordagem por capacidade evita inventar um; uma implantação real compararia o custo de revisar um pedido com o custo de um atraso.',
      ],
      reproduction: {
        intro:
          'O contrato de atributos, a divisão e os helpers de avaliação têm testes unitários, incluindo checagens de que nenhuma coluna proibida pós-compra entra na lista de atributos e de que o treino para três meses antes do corte de teste.',
        commands: [
          'uv run python tasks.py db-up',
          'uv run python tasks.py data',
          'uv run python tasks.py load',
          'uv run python tasks.py dbt-build',
          'uv run python tasks.py train',
        ],
        note:
          'train escreve model_metrics.json, a tabela de importância por permutação e as figuras do relatório. O modelo treinado não é versionado.',
      },
      charts: {
        calibration: {
          title: 'Calibração na amostra temporal',
          subtitle: 'Previsto contra observado em dez faixas de score de 3.215 pedidos cada',
          note: 'model_metrics.json. A diagonal tracejada é calibração perfeita; a linha horizontal é a taxa observada de 4,42%. A previsão média é 4,26%. O nono decil prevê 7,0% e observa 9,8%; o topo prevê 12,3% e observa 8,7%. Inclinação 0,82, intercepto −0,47.',
          description:
            'Gráfico de dispersão do risco previsto contra o observado para regressão logística e boosting. O nono decil prevê 7,0% e observa 9,8%; o topo prevê 12,3% e observa 8,7%. A taxa base observada é 4,42%.',
        },
        capacity: {
          title: 'Precisão por capacidade de revisão',
          subtitle: 'Revisando os 5%, 10% ou 20% de maior score dos 32.150 pedidos de teste; a linha tracejada é a taxa base de 4,42%',
          note: 'model_metrics.json. Os rótulos trazem recall, lift e o número de pedidos revisados. A linha tracejada é a taxa base de 4,42%. A precisão com 5% é menor que com 10%.',
          description:
            'Barras de precisão com 5%, 10% e 20% de capacidade: 7,7%, 8,7% e 9,2%. Uma linha tracejada marca a taxa base de 4,42%. O recall sobe de 8,7% para 41,8% e o lift de 1,74× para 2,09×.',
        },
        stability: {
          title: 'Estabilidade ao longo do tempo',
          subtitle: 'Precisão média por origem móvel, e AUC mensal na amostra',
          note: 'model_metrics.json. As origens móveis treinam com rótulos maduros três meses antes e avaliam os três meses seguintes. A AUC mensal é dentro da amostra de abril–agosto. A linha tracejada é a taxa base de 4,42% (0,044 nesta escala).',
          description:
            'Duas abas. Origem móvel: precisão média por corte para logística e boosting, de cerca de 0,056 a 0,184 conforme a taxa de atraso sobe. Mês de teste: AUC mensal da amostra, de 0,60 em agosto a 0,79 em junho.',
        },
        importance: {
          title: 'O que o modelo está usando',
          subtitle: 'Queda na precisão média ao embaralhar um atributo bruto',
          note: 'feature_importance.csv. Embaralhar no nível bruto mantém uma categoria como um conceito. Os valores são associacionais, não efeitos causais.',
          description:
            'Barras horizontais de importância por permutação. promise_days lidera com 0,026, customer_state vem depois com 0,017, seller_state com 0,003, e os demais atributos ficam perto de zero.',
        },
      },
    },
    'voice-of-customer': {
      metaTitle: 'Modelagem de Tópicos de Reclamações e Análise Comparativa — Anderson Tavares',
      metaDescription:
        '9.139 reclamações escritas de 1–2 estrelas: as de atrasados são sobre o pacote (65,7%) e as de pedidos no prazo sobre o produto (68,9%), com a seleção declarada antes.',
      kicker: 'Projeto 03 · Modelagem de Tópicos de Reclamações e Análise Comparativa',
      title: 'Modelagem de Tópicos de Reclamações e Análise Comparativa',
      deck:
        'Um modelo de tópicos sobre o texto em português que os clientes escreveram. Clientes de pedidos atrasados e no prazo não estão tendo a mesma conversa: um fala do pacote, o outro do produto.',
      heroStats: [
        { value: '9.139', label: 'reclamações utilizáveis', note: 'Avaliações de 1–2 estrelas em pedidos entregues, com ao menos dois tokens após normalização.' },
        { value: '29,7%', label: 'das reclamações são de atrasados', note: 'Pedidos atrasados são 6,8% das entregas. O corpus é selecionado pelo desfecho.' },
        { value: '65,7% vs 18,5%', label: 'entrega + não recebimento', note: 'Reclamações de atrasados contra pedidos no prazo. Os tópicos de produto vão no sentido oposto.' },
      ],
      sectionLabels: {
        question: 'A pergunta',
        why: 'Por que importa',
        data: 'Dados e escopo',
        method: 'Método',
        findings: 'O que as reclamações dizem',
        implications: 'O que eu faria',
        limitations: 'Limitações',
        reproduction: 'Reproduzir',
      },
      tocTitle: 'Nesta página',
      question: [
        'O Projeto 01 mediu o atraso pelo lado do pedido e encontrou o sinal mais forte de insatisfação. Este projeto lê o outro lado: o texto em português que os clientes realmente escreveram. A pergunta é do que eles reclamam, e se isso muda quando o pacote chega atrasado.',
        'A resposta curta é que muda quase completamente. Reclamações de atrasados são sobre o pacote. Reclamações de pedidos no prazo são sobre o produto. É um resultado mais útil que um único score de sentimento porque as duas falhas têm donos diferentes.',
      ],
      why: [
        'Uma única fila de “baixa satisfação” esconde dois problemas operacionais diferentes. Um pedido atrasado que nunca chegou precisa da operação de entrega. Um pedido no prazo com a cor errada precisa de catálogo, qualidade ou embalagem. Encaminhar os dois para a mesma equipe porque ambos deram uma estrela desperdiça o sinal que está no texto.',
        'O resultado também muda como o volume de avaliações deve ser lido. Pedidos atrasados são 6,8% das entregas mas 29,7% do corpus de reclamações, porque são mais avaliados e muito mais avaliados mal. Uma contagem de reclamações sem denominador não é uma métrica de satisfação.',
      ],
      data: [
        'Há 99.224 linhas de avaliação, mas a maioria dos pedidos não tem comentário escrito, e os que têm são selecionados pelo desfecho. Restringindo a pedidos entregues e à avaliação mais recente por pedido, chega-se a 96.476 entregas.',
        'Pedidos no prazo: 89.941, com 35.138 comentários (39,07%) e 6.490 comentários de nota baixa (7,22%). Pedidos atrasados: 6.535, com 3.762 comentários (57,57%) e 2.747 comentários de nota baixa (42,04%).',
        'A seleção é a primeira descoberta, não uma ressalva no fim. Um pedido atrasado tem 1,47 vez mais chance de receber avaliação escrita, e uma avaliação de nota baixa tem 5,8 vezes mais chance. Pedidos atrasados são 6,8% das entregas mas 29,7% das reclamações que conseguimos ler. Toda participação abaixo é participação nas reclamações, não nos pedidos ou clientes.',
        'O corpus contém 9.237 comentários de nota baixa; 9.139 mantêm ao menos dois tokens após normalização, então 98 veredictos de uma palavra como “ruim” são descartados. Outros 3.039 comentários de nota baixa não têm texto e nunca entram.',
      ],
      method: {
        intro: [
          'O método é deliberadamente simples e fixado antes de olhar o desfecho. O rótulo de entrega é juntado depois que os tópicos são ajustados, nunca usado como entrada.',
        ],
        steps: [
          'Uma avaliação por pedido entregue: a mais recente por review_created_at e depois review_id. Juntar as 99.224 linhas diretamente adicionaria 551 linhas duplicadas em 547 pedidos e inflaria todos os denominadores.',
          'Manter avaliações de 1–2 estrelas com comentário. A nota é o sinal negativo; o modelo não precisa descobrir sentimento, só descrever do que a reclamação trata.',
          'Normalizar de forma conservadora: minúsculas, remover links, dígitos e pontuação, manter acentos e descartar palavras funcionais do português e nomes de vendedores. A negação fica, porque “não recebi” e “recebi” são reclamações diferentes.',
          'Ajustar LDA com seis tópicos em unigramas e bigramas (min_df 20, max_df 0,5, random_state 0, max_iter 30). Atribuir cada reclamação ao tópico de maior peso e rotular os tópicos pelos termos do topo. Uma checagem em tempo de execução confirma que cada tópico ainda contém seu termo-âncora.',
          'Checar a estabilidade em vez de assumi-la. Refits com sementes 1–4: índice de Rand ajustado médio de 0,258 contra a semente 0 e Jaccard médio de 0,413 nos termos do topo. A partição exata não é estável; o contraste logística/produto é. Uma auditoria manual estratificada leu 30 reclamações, cinco por tópico.',
        ],
      },
      findings: {
        intro: [
          'A comparação é composicional: a participação de cada tópico nas reclamações de atrasados contra sua participação nas de pedidos no prazo. Os denominadores são 2.711 reclamações de atrasados e 6.428 de pedidos no prazo, e as diferenças são em pontos percentuais com intervalos de 95% para duas proporções.',
        ],
        bullets: [
          'Problemas de entrega são 39,8% das reclamações de atrasados contra 11,0% das de pedidos no prazo (+28,8 pp, intervalo +26,8 a +30,8). Não recebimento é 25,9% contra 7,5% (+18,4 pp). Demora é 16,2% contra 12,6% (+3,6 pp) e é reportada separadamente porque é mista.',
          'Qualidade ou “diferente do anunciado” é 26,7% das reclamações no prazo contra 5,6% das de atrasados (−21,1 pp). Pedido incompleto é 22,8% contra 4,2% (−18,6 pp), e item errado, defeito ou troca é 19,4% contra 8,3% (−11,1 pp).',
          'Agrupar os tópicos à mão deixa a separação mais nítida. Entrega e não recebimento juntos são 65,7% das reclamações de atrasados e 18,5% das de pedidos no prazo. Os três tópicos de produto são 18,1% contra 68,9%. O agrupamento é um resumo do analista, não uma saída do modelo.',
          'Todas as seis diferenças têm intervalos de 95% que excluem zero e q-valores de Benjamini–Hochberg abaixo de 0,001. A direção não depende de forçar cada reclamação em um tópico: usando a distribuição completa, entrega e não recebimento carregam 58,9% do peso das reclamações de atrasados contra 22,8% das no prazo; os tópicos de produto carregam 24,9% contra 63,1%.',
          'A alternativa com quatro tópicos não derruba a manchete. Com k=4, os tópicos de entrega/não recebimento concentram 83,3% das reclamações de atrasados e 29,3% das no prazo; os de produto/pedido, 16,7% e 70,7%. O mesmo contraste, com fronteiras mais grossas.',
          'Seis foi a escolha inicial da análise, não um ótimo de coerência estabelecido de antemão. Uma checagem posterior com a semente 0 coloca k=6 no topo da coerência UMass (−2,677), mas a média das sementes é maior em k=4 (−2,628 contra −2,739). k=4 junta produto e troca, então seis é mantido pela granularidade. É um julgamento de interpretação, não evidência de que seis seja o número verdadeiro de tópicos.',
          'Os rótulos são legíveis, mas não confiáveis no nível individual. A auditoria manual encontrou 20 de 30 claramente consistentes, 5 parcialmente consistentes e 5 dominados por outro tema. O tópico de demora foi o mais fraco: três das cinco reclamações amostradas eram principalmente sobre qualidade do produto ou item errado. É a leitura de um analista, não codificação independente.',
          '22,7% das reclamações têm o maior peso de tópico abaixo de 0,5, 7,5% abaixo de 0,4, e 31,7% têm um segundo tópico em 0,3 ou mais. A entropia normalizada média é 0,522. Um pedido atrasado, danificado e incompleto muitas vezes tem massa em mais de um tema.',
        ],
        outro: [
          'As palavras são evidência do que cada tópico trata, não uma explicação causal. “Correios” aparece no tópico de problema de entrega, mas o conjunto não tem identificador de transportadora, então o tópico não estabelece quem causou o atraso.',
        ],
      },
      implications: {
        intro: [
          'A implicação operacional é duas filas, não uma. Reduzir o atraso removeria a maior fonte de reclamações de atrasados, mas não tocaria nas reclamações de produto e completude que dominam o grupo no prazo.',
        ],
        items: [
          {
            title: 'Separar a fila por causa, não por nota',
            body:
              'Encaminhar reclamações de pedidos atrasados para a operação de entrega, e reclamações de produto de pedidos no prazo para catálogo, qualidade e embalagem. A maior diferença nos atrasados é entrega; a maior diferença nos pedidos no prazo é qualidade do produto. Um único balde de “baixa satisfação” esconde os dois.',
          },
          {
            title: 'Reportar reclamações por pedido entregue, dentro do desfecho',
            body:
              'A taxa de avaliação muda com o desfecho: 57,6% dos pedidos atrasados têm comentário contra 39,1% dos no prazo, e 42,0% têm comentário de nota baixa contra 7,2%. Uma contagem bruta de reclamações sem esse denominador não é um KPI de satisfação.',
          },
          {
            title: 'Codificar uma amostra à mão antes do uso operacional',
            body:
              'Os seis tópicos são um resumo derivado com rótulos subjetivos. Algumas centenas de reclamações codificadas à mão estabeleceriam se as fronteiras entre “demora”, “problema de entrega” e “não recebido” são estáveis o bastante para triagem.',
          },
          {
            title: 'Manter a fila de produto financiada',
            body:
              'Mesmo uma operação de entrega perfeita deixaria as reclamações de pedidos no prazo. 68,9% da mistura de reclamações no prazo é de produto, e esses pedidos cumpriram a promessa. Os dois problemas têm donos e correções diferentes.',
          },
        ],
      },
      limitations: [
        'Nenhuma afirmação causal. Um tópico ser mais comum entre reclamações de atrasados é uma associação entre um desfecho de entrega e o assunto da reclamação. O corpus selecionado torna até a associação descritiva de quem reclama.',
        'Nenhuma afirmação sobre todos os clientes. 57,6% dos pedidos atrasados têm comentário contra 39,1% dos no prazo. Quem escreve não é uma amostra aleatória, e nada aqui estima a mistura de reclamações da maioria silenciosa.',
        'Nenhuma afirmação sobre experiência positiva. Só avaliações de 1–2 estrelas são modeladas. A análise diz do que reclamaram os insatisfeitos, não o que os satisfeitos valorizaram.',
        'Tópicos são uma simplificação: seis tópicos, atribuição dura, saco de palavras, rótulos subjetivos e categorias sobrepostas. A checagem de estabilidade mostra que a partição exata não é estável, embora o agrupamento amplo seja.',
        'Uma reclamação sobre um pedido atrasado, danificado e incompleto é forçada em um tópico. 22,7% têm o maior peso abaixo de 0,5, e a entropia normalizada média é 0,522.',
        'Outros valores de k produziriam uma partição diferente, mas não necessariamente errada. k=4 preserva o contraste principal com fronteiras mais grossas.',
        'Um marketplace e um período: Olist, setembro de 2016 a outubro de 2018. O vocabulário e a operação de entrega são específicos.',
        'O rótulo é a promessa, não o scan da transportadora. is_late significa que a data de entrega é posterior à data prometida. Não há transportadora, rota ou armazém, então “problema de entrega” não pode ser atribuído a um responsável.',
        'A auditoria manual é a leitura de um analista sobre 30 reclamações. Ela sustenta a leitura ampla do corpus, não a atribuição exata de uma reclamação individual.',
      ],
      reproduction: {
        intro:
          'Um script lê os marts construídos, ajusta o modelo e escreve todas as tabelas e figuras. O modelo é determinístico dada a versão fixada do scikit-learn, a semente e o corpus fixo.',
        commands: [
          'uv run python tasks.py db-up',
          'uv run python tasks.py data',
          'uv run python tasks.py load',
          'uv run python tasks.py dbt-build',
          'uv run python tasks.py topics',
          'uv run pytest',
        ],
        note:
          'topics escreve review_scope.json, topic_prevalence.csv, topic_groups.csv, topic_groups_k4.csv, topic_selection.csv e as figuras. Ele falha se uma atualização de biblioteca reordenar os âncoras dos tópicos, em vez de renomeá-los em silêncio.',
      },
      charts: {
        groups: {
          title: 'A mistura de reclamações dentro de cada desfecho',
          subtitle: 'Participação de reclamações de atrasados e no prazo em três temas agrupados à mão',
          note: 'topic_groups.csv. Entrega e não recebimento combinam dois tópicos; Produto combina qualidade, pedido incompleto e item errado/troca. Demora é o tema misto e não entra na logística.',
          description:
            'Barras horizontais agrupadas. Entrega e não recebimento são 65,7% das reclamações de atrasados contra 18,5% das no prazo; produto é 18,1% contra 68,9%; demora mista é 16,2% contra 12,6%. Rótulos trazem a diferença em pontos percentuais e os intervalos.',
        },
        topics: {
          title: 'Cada tópico, atrasados contra no prazo',
          subtitle: 'Participação das reclamações em cada desfecho; a linha é a diferença',
          note: 'topic_prevalence.csv. Intervalos de 95% para duas proporções; as seis diferenças excluem zero após a correção de Benjamini–Hochberg.',
          description:
            'Gráfico de halteres para seis tópicos. Problema de entrega é 39,8% dos atrasados contra 11,0% dos no prazo; não recebimento 25,9% contra 7,5%; demora 16,2% contra 12,6%; qualidade 5,6% contra 26,7%; pedido incompleto 4,2% contra 22,8%; item errado 8,3% contra 19,4%.',
        },
        coherence: {
          title: 'Por que seis tópicos',
          subtitle: 'Coerência UMass por número de tópicos, semente 0 contra a média das sementes 0–2',
          note: 'topic_selection.csv. k=6 é o maior na semente 0; a média das sementes é maior em k=4. Seis foi a escolha inicial e é mantido pela granularidade, não porque seja o ótimo de coerência.',
          description:
            'Gráfico de linhas da coerência para k=4 a 10. A linha da semente 0 tem pico em k=6 (−2,677); a média das sementes tem pico em k=4 (−2,628). As diferenças são pequenas em relação à dispersão entre sementes.',
        },
        mixed: {
          title: 'Muitas reclamações são mistas',
          subtitle: 'Quanto peso o maior tópico carrega',
          note: 'review_scope.json. Um maior peso abaixo de 0,5 significa que nenhum tema domina; a entropia normalizada média é 0,522 em escala 0–1. A atribuição dura é uma simplificação, e ela é mensurável.',
          description:
            'Barras de estatísticas: 22,7% das reclamações têm o maior peso abaixo de 0,5, 7,5% abaixo de 0,4, e 31,7% têm um segundo tópico em 0,3 ou mais. A entropia normalizada média é 0,522 em uma escala de 0 a 1.',
        },
      },
    },
  },
  about: {
    metaTitle: 'Sobre — Anderson Tavares',
    metaDescription:
      'Analista de dados com SQL, dbt e Python. Dados de marketplace e operações, pipelines reproduzíveis e análises escritas que declaram suas limitações.',
    title: 'Anderson Tavares',
    intro: [
      'Analista de dados. Trabalho com SQL como primeira língua, modelo dados com dbt e escrevo a análise de modo que alguém que não escreve SQL consiga acompanhar o argumento e reconferir os números.',
      'A maior parte do meu trabalho é com dados de marketplace e de operações, onde a parte difícil é decidir o que um número significa. Os três estudos aqui são um conjunto de dados e três perguntas diferentes: medição, previsão e texto.',
    ],
    lookingFor: 'Em busca de posições de analista de dados ou cientista de dados.',
    toolsHeading: 'Com o que eu trabalho',
    tools: [
      { area: 'Consulta e modelagem', items: 'PostgreSQL, dbt, SQL avançado (funções de janela, CTEs), modelagem dimensional' },
      { area: 'Análise', items: 'Python (pandas, scikit-learn, matplotlib, seaborn), raciocínio estatístico, modelagem de tópicos' },
      { area: 'Engenharia', items: 'Git, Docker, pytest, GitHub Actions, uv, React e TypeScript para o site publicado' },
      { area: 'Comunicação', items: 'Redação técnica, memorandos de decisão, documentação bilíngue (EN/PT)' },
    ],
    principlesHeading: 'Como eu trabalho',
    principles: [
      {
        title: 'Começar por uma decisão',
        body: 'Toda análise existe para responder a uma pergunta que alguém pagaria para ver respondida. Se a resposta não mudaria uma ação, é descrição, não análise.',
      },
      {
        title: 'Testar os dados, não só o código',
        body: 'Se uma premissa quebra, o build deve falhar ruidosamente. O projeto dbt carrega 91 testes de dados, incluindo retenção do mês zero e a concordância entre o flag de atraso e os dias de atraso.',
      },
      {
        title: 'Escrever as limitações',
        body: 'Uma conclusão sem suas ressalvas é um passivo. Todo projeto declara o que os dados não sustentam antes da recomendação, não depois.',
      },
      {
        title: 'Preferir o número honesto',
        body: 'A versão anterior do modelo de atraso parecia melhor porque sua regra de treino removia os pedidos mais lentos. Corrigir isso baixou o lift da manchete. O número menor é o que está neste site.',
      },
    ],
    contactHeading: 'Contato',
    contactNote:
      'O caminho mais rápido para falar comigo é e-mail. Posso apresentar o SQL, o desenho de avaliação ou as partes que não funcionaram.',
    links: [
      { label: 'GitHub', value: 'AndersonTavares0', href: 'https://github.com/AndersonTavares0' },
      { label: 'LinkedIn', value: 'andersonlimatavares', href: 'https://www.linkedin.com/in/andersonlimatavares' },
      { label: 'E-mail', value: 'anderson.g.tavares@gmail.com', href: 'mailto:anderson.g.tavares@gmail.com' },
    ],
    note:
      'O código é MIT. O conjunto Olist é CC BY-NC-SA 4.0, não comercial, e não é redistribuído aqui. Todos os números publicados são agregados dos marts testados; nenhum texto bruto de avaliação é reproduzido.',
  },
  footer: {
    line: 'Applied Data Science — Um estudo reproduzível em ciência de dados. Primeira coleção: operações de e-commerce Olist.',
    source: 'Fonte e reprodução',
    licence: 'Código MIT · Dados CC BY-NC-SA 4.0',
    note: 'Site estático. Sem rastreamento, sem cookies, sem analytics.',
  },
  common: {
    figure: 'Figura',
    sourceLabel: 'Fonte',
    definition: 'Definição',
    readCase: 'Ler o estudo de caso',
    published: 'Publicado',
    methodLabel: 'Método',
    limitationLabel: 'O que isto não pode dizer',
    openSource: 'Ver o repositório',
    backHome: 'Voltar à página inicial',
  },
}
