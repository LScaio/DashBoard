# Ciência Delas

**Dados que revelam histórias. Ciência que dá visibilidade.**

Protótipo conceitual de experiência digital desenvolvido para a **Ciência Delas**, uma iniciativa que dá visibilidade à presença, à realidade e às contribuições das mulheres na ciência, na tecnologia e na sociedade.

Recorte temático: **Mulheres em zonas de conflito: a violência contra mulheres durante a guerra da Ucrânia.**

> **Protótipo • Dados demonstrativos.** Todos os números vêm de um pequeno conjunto fictício (`src/data/demoData.ts`, 36 registros marcados como DEMO DATA).
> Eles **não representam estatísticas oficiais** e não descrevem pessoas ou eventos reais. As instituições citadas aparecem apenas como fontes de referência para uma futura implementação.

**Site:** https://lscaio.github.io/DashBoard/

## Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # verificação de tipos + build de produção
```

## A experiência

1. **Abertura:** "CIÊNCIA DELAS" → "Quando os números falam, quem estamos ouvindo?" → "Mulheres."
2. **Hero:** título, chamada "Explorar o projeto" e uma ilustração abstrata (o símbolo ♀ como instrumento científico, com órbitas e uma constelação de dados).
3. **Contexto:** texto editorial sobre como a guerra muda a vida das mulheres.
4. **Dados:** quatro indicadores grandes, o gráfico "A violência ao longo do tempo" (2022–2026, com seleção de categoria) e "Nem toda violência é visível".
5. **Quanto tempo?:** contador calculado ao vivo desde 24/02/2022, com a ressalva de que não representa um episódio contínuo de violência.
6. **Mapa:** mapa estilizado em hexágonos, com tooltip de região, registros demonstrativos e período.
7. **Por trás do número:** três narrativas conceituais.
8. **E onde entra a ciência?:** Ciência, Tecnologia e Mulheres como produtoras de conhecimento.
9. **Quem produz esses dados?** e **O que os dados não conseguem mostrar?**
10. **Encerramento.**

Não há backend, login, banco de dados nem API. Tudo roda com dados locais.

## Tecnologia

React · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · Recharts · Lucide React

```
src/
  components/
    art/        HeroArt (ilustração SVG)
    charts/     YearlyChart, TypesChart
    layout/     Intro, TopNav, Footer
    map/        UkraineHexMap, geometria dos hexágonos
    sections/   Hero, Context, DataSection, TimeSection, MapSection,
                Stories, Science, Sources, Limits, Finale
    ui/         Reveal, CountUp, DemoTag, SectionHeading
  data/         demoData.ts (DEMO DATA), regions, labels
  hooks/        scroll-spy da navegação
  utils/        datas e contagens
```

## Publicação

Cada push na `main` publica o site no GitHub Pages pelo workflow `.github/workflows/deploy.yml`. Configuração única: em **Settings → Pages → Build and deployment**, defina **Source** como **GitHub Actions**.
