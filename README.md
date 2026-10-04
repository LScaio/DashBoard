# Women & Conflict — Ciência Delas Data Lab

Prototype **data dashboard** made for **Ciência Delas**, an initiative focused on women and science. It shows how data can be used to visualise, analyse and understand violence against women in the context of the war in Ukraine.

> **Demo data.** Every figure comes from a synthetic, seeded dataset (`src/data/demoIncidents.ts`). The numbers are **not official statistics** and do not describe real events or people. The organisations on the Sources page are reference sources only; none of them is connected.

**Live:** https://lscaio.github.io/DashBoard/

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## What's in the dashboard

- **Layout:** fixed sidebar, a header with search and filters toggle, a filter bar, and the main grid.
- **Filters:** date range, region, violence type, victim group and verification. They update the KPIs, the charts, the map and the table. Clicking a map region, a violence-type bar or a type row also applies a filter.
- **Overview page:**
  - KPIs: documented incidents (with change vs previous 12 months), conflict-related sexual violence (count and share), affected regions, reporting period.
  - **How long?:** days, years, months and days since 24 Feb 2022, computed live.
  - **Documented incidents over time:** monthly line chart with an All / Sexual / Physical / Psychological toggle.
  - **Geographic distribution:** stylised hex map of Ukraine. The tooltip shows region, documented incidents, reporting period and confidence.
  - **Violence types** and **Victim profile** (age group; age is only known for a subset of records).
  - **Incident records:** table with search, sorting and pagination. Clicking a row opens a detail drawer.
  - **Documentation gap**, **Data limitations** and a **timeline** of generic phases.
- **Other pages:** Timeline, Geographic, Violence, Women, Incidents and Sources (simplified prototype views).

All indicators are computed from the dataset in `src/utils/metrics.ts`. No figures are hard-coded in the UI.

## Stack

React · TypeScript · Vite · Tailwind CSS v4 · Recharts · Framer Motion · Lucide React. There is no backend, database or authentication.

```
src/
  components/layout/   Sidebar, Header, FilterBar, Footer
  components/widgets/  KPIs, charts, map, table, drawer, cards
  components/ui/       Card, Badge, Select, Segmented, DemoTag, CountUp
  data/                demoIncidents.ts (DEMO DATA), regions, labels, sources
  pages/               page layouts + registry
  state/               filters, search, selection, current page
  utils/               metrics, dates, formatting
```

## Deployment

Every push to `main` is deployed to GitHub Pages by `.github/workflows/deploy.yml`.
