# UKRAINE — WOMEN & CONFLICT

**Humanitarian Intelligence Dashboard — prototype**

An interactive prototype showing how an analysis platform for documented violence against women and girls in the war in Ukraine could work.

> ⚠️ **Demonstration data only.** Every figure in this app comes from a synthetic, seeded dataset (`src/data/incidents.ts`).
> The figures are **not official statistics**, do not describe real events or people, and must not be cited.
> The institutions listed under *Sources & Methodology* are **potential** data sources. None of them is integrated.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serve the production build
```

Other scripts: `npm run lint` (oxlint), `npm run format` (prettier), `npm run typecheck`.

## Stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · Recharts · Framer Motion · Lucide icons

## What's inside

| Area | Highlights |
|---|---|
| **Overview** | Animated "How long has the violence persisted?" counter (since 24 Feb 2022, computed live), documented reporting period, a 5-question briefing, KPI cards with count-up and trend |
| **Timeline** | Monthly area chart with series toggle (all / sexual / physical / conflict-related / other), detailed tooltip, shaded reporting-lag area |
| **Geography** | Schematic hex-tile map of Ukraine's regions: LOW/MEDIUM/HIGH legend, hover tooltip (incidents, reporting period, data confidence), click to filter, ranked list |
| **Violence types** | Donut and breakdown list with count, share and trend; click to filter |
| **CRSV** | A restrained section with its own metrics, a monthly chart and an underreporting notice |
| **Victim profiles** | Age groups, civilian/displaced, context and location, all as privacy-preserving aggregates |
| **Documentation gap** | A conceptual "Known / Underreported / Unknown" visual. It makes no numeric estimate. |
| **Incident records** | Search, type filter, sortable columns, pagination, badges; a row opens a detail drawer with a "View source" placeholder |
| **Filters** | Date range (with presets), region, type, source, verification, victim group. They update every card, chart, the map and the table. |
| **Export** | CSV of the filtered records (labelled as demo data), PDF through the print dialog, and a PNG placeholder |
| **Transparency** | "Demonstration data", "Not official statistics", "Documented cases only" and "Data limitations apply" labels throughout |

## Project structure

```
src/
  components/
    charts/      TimelineChart, ViolenceTypeChart, VictimProfile, tooltip & theme
    dashboard/   StatCard/StatGrid, ConflictDuration, BriefingPanel, CrsvSection,
                 DocumentationGap, KeyObservations, MethodologyPanel, ExportMenu …
    filters/     FilterPanel, ActiveFilters, form fields
    layout/      Sidebar, DashboardHeader, SplashScreen, Logo
    map/         GeographicMap (hex tile cartogram)
    sources/     SourceCard, SourcesSection
    tables/      IncidentTable, IncidentDrawer
    ui/          Panel, Badge, DataLabel, CountUp, Skeleton, InfoTip, Toaster …
  context/       Dashboard state (filters, selection, toasts)
  data/          incidents.ts (DEMO DATA), regions, labels, potential sources
  hooks/         scroll-spy, media query
  pages/         DashboardPage
  types/         Domain types
  utils/         filtering & aggregation, dates, CSV export, formatting
```

## Connecting real data

Replace `DEMO_INCIDENTS` in `src/data/incidents.ts` with records that match the `Incident` type, and update `DATASET_META`. All aggregation happens in `src/utils/analytics.ts`, so the UI needs no other changes. Before you remove the demo labels, review them together with the methodology text.

## Privacy & ethics

- Records have no names, addresses, contact details, narrative descriptions or other identifying fields.
- Counts are presented as **documented records**, never as the total scale of violence.
- Regions are compared on "reported incidents in dataset", with a reminder that population, access and documentation capacity differ.
- Imagery is not graphic, and the visual language is restrained.
