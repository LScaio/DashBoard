# Ciência Delas — Mulheres e conflito | Ucrânia

Dashboard sobre violência contra mulheres no contexto do conflito na Ucrânia, feito para a iniciativa **Ciência Delas**.

**Site:** https://lscaio.github.io/DashBoard/

## De onde vêm os dados

Todos os números exibidos vêm da planilha do projeto, exportada em dois arquivos:

| Arquivo | Conteúdo |
| --- | --- |
| `public/data/dados.csv` | aba **Dados**: um indicador por linha (categoria, período, valor, unidade, status, método, fonte, URL, observações) |
| `public/data/metadados.csv` | aba **Metadados**: data de preparação, aviso principal e regras de leitura |

O código não contém valores fixos: cartões, gráficos, checagens e tabela leem esses arquivos (`src/data/dataset.ts`).

Regras aplicadas na interface:

- Linhas com status **Estimativa** aparecem como _Estimativa não verificada_, com “≈” e cor própria (rosa tracejado). Não são apresentadas como contagens oficiais.
- Estimativas com fonte “Estimativa derivada de …” são marcadas como **cálculo não oficial**, e não como número da instituição citada.
- Os períodos aparecem exatamente como na planilha. Períodos parciais (ex.: 2026, jan–jul) são desenhados tracejados e rotulados.
- Categorias diferentes nunca são somadas. O gráfico “Mulheres no total de cada indicador” mostra cada indicador em relação ao próprio total (tirado da coluna Valor ou das Observações).
- A planilha não tem dados por região, por isso o mapa foi retirado.
- O painel recalcula três checagens de consistência e mostra o resultado: soma das estimativas anuais = acumulado; desagregação dos civis mortos 2014–2021; atribuições de CRSV = total.

### Como atualizar os dados

1. Edite a planilha e exporte as abas **Dados** e **Metadados** como CSV (UTF-8), mantendo os nomes das colunas.
2. Substitua `public/data/dados.csv` e `public/data/metadados.csv`.
3. Faça push na `main`. O GitHub Pages publica o site, e quem estiver com o painel aberto vê os novos valores na próxima verificação.

## Atualização simulada

Não existe conexão com uma fonte em tempo real. O painel mostra:

- o relógio atual e um indicador pulsante **Atualização simulada**;
- o horário em que os dados foram carregados e a data de preparação da planilha;
- uma verificação a cada 60 s: o painel relê os CSV publicados (`src/hooks/useDataSource.ts`). Se o conteúdo não mudou, aparece “arquivo sem alterações” e os números ficam iguais. Os valores só mudam, com animação, quando o arquivo é de fato substituído. Nenhum número é gerado ou alterado aleatoriamente.

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # verificação de tipos + build
npm run lint
```

## O que tem na tela

- **Cabeçalho:** período coberto pela planilha, relógio, status da atualização simulada
- **4 cartões:** violência sexual relacionada ao conflito (mulheres), mulheres civis mortas (fev–jul 2022), vítimas civis mulheres acumuladas (estimativa), aumento de casos registrados de violência doméstica, cada um com status, período, observação e fonte
- **Mulheres vítimas civis por ano:** estimativas anuais 2022–2026, com 2026 parcial
- **Quanto tempo?:** dias desde 24/02/2022, calculados pela data do dispositivo
- **Mulheres no total de cada indicador:** parcela de mulheres por indicador, em 2014–2021 ou 2022–2026
- **Qualidade dos dados:** documentados × estimativas × não disponíveis e checagens de consistência
- **Como interpretar os dados:** aviso e regras da aba Metadados
- **Planilha de dados:** todas as linhas, com filtro por status, links para as fontes e download do CSV

Os links abrem os documentos citados na planilha. O painel não confere o conteúdo desses documentos, e a verificação dos valores ainda não foi concluída.

## Estrutura

```
public/data/              dados.csv, metadados.csv  (fonte única dos números)
src/
  App.tsx                 a dashboard
  components/             Header, KpiCards, TimelineChart, TimeCounter, ShareChart,
                          DataStatus, DataNote, DataTable, StatusBadge, SourceLink, Card
  data/dataset.ts         leitura do CSV, seletores e checagens de consistência
  hooks/                  useDataSource (atualização simulada), useNow, useMediaQuery
  utils/                  format.ts (números e datas pt-BR), date.ts
```

React · TypeScript · Vite · Tailwind CSS v4 · Recharts · Framer Motion. Não há backend, banco de dados nem autenticação.

Cada push na `main` publica o site no GitHub Pages (`.github/workflows/deploy.yml`).
