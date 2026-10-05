# Ciência Delas — Mulheres e conflito

Protótipo de **uma única dashboard** sobre violência contra mulheres no contexto da guerra da Ucrânia, feito para a iniciativa **Ciência Delas**.

> **Dados demonstrativos.** Os números vêm de um conjunto sintético gerado de forma determinística (`src/data/demoIncidents.ts`). Eles **não são estatísticas oficiais** e não descrevem pessoas ou eventos reais.

**Site:** https://lscaio.github.io/DashBoard/

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # verificação de tipos + build
```

## O que tem na tela

- **Cabeçalho:** Ciência Delas · Mulheres e conflito · 24 FEV 2022 → ATUAL · Dados demonstrativos
- **4 KPIs:** incidentes documentados, violência sexual relacionada ao conflito, regiões representadas, período
- **Incidentes ao longo do tempo:** gráfico mensal com seletor Todos / Sexual / Física / Psicológica
- **Quanto tempo?:** dias, anos, meses e dias desde 24/02/2022, calculado na hora
- **Tipos de violência:** barras horizontais
- **Distribuição geográfica:** mapa estilizado em hexágonos; ao passar o mouse aparecem a região e os registros
- **Como interpretar os dados**

Em telas desktop com 820 px de altura ou mais, tudo cabe sem rolagem. No celular, os cards são empilhados.

## Estrutura

```
src/
  App.tsx                 a dashboard
  components/             Header, KpiCards, TimelineChart, TimeCounter,
                          ViolenceChart, UkraineMap, DataNote, Card
  data/                   demoIncidents.ts (DEMO DATA), regions, labels
  utils/                  stats.ts (indicadores), date.ts
```

React · TypeScript · Vite · Tailwind CSS v4 · Recharts · Framer Motion. Não há backend, banco de dados nem autenticação.

Cada push na `main` publica o site no GitHub Pages (`.github/workflows/deploy.yml`).
