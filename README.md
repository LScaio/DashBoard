# Ciência Delas — Mulheres e conflito na Ucrânia

Dashboard de visualização de dados sobre o impacto da guerra na Ucrânia sobre mulheres e meninas, desenvolvida por alunos do SESI para a iniciativa **Ciência Delas**.

**Site:** https://lscaio.github.io/DashBoard/ · **Fontes e metodologia:** https://lscaio.github.io/DashBoard/fontes.html

> Todos os números vêm de fontes oficiais, com data e link. Nenhum número é estimado, simulado ou interpolado.

## O que tem na tela

- **Contador ao vivo** — dias, horas, minutos e segundos desde 24/02/2022, 00h00 (horário de Kyiv), atualizado a cada segundo.
- **Indicadores** — mulheres e meninas mortas, feridas, sobreviventes de violência sexual e deslocadas, cada um com a fatia do total, a fonte, o período e um selo de atualização.
- **Mapa da Ucrânia** — 27 regiões com escala em roxo/lilás (mais registros = cor mais intensa), legenda, detalhes ao passar o mouse, tocar ou usar Tab, e versão em tabela.
- **Linha do tempo por tipo de violência** — física (violeta), sexual (magenta) e deslocamento forçado (âmbar), em painéis com escalas próprias e legenda clicável para ligar/desligar cada tipo. Violência psicológica aparece como “sem série oficial”: nenhuma fonte oficial publica essa série, e a dashboard não inventa números.
- **Violência sexual documentada pela ONU** — casos por contexto (prisioneiros de guerra, civis detidos, civis em áreas ocupadas) e por sexo.
- **Vítimas civis por sexo e idade** — mortos e feridos, com destaque para o mês mais recente.
- **QR Code** — leva à página de fontes (instituições, links originais, períodos, metodologia).
- **Tema claro (padrão) e escuro** — botão no canto superior direito; a escolha fica salva no navegador.

## Fontes

| Dado | Instituição | Atualização |
| --- | --- | --- |
| Civis mortos e feridos por sexo, idade e mês | ONU · ACNUDH / Missão de Monitoramento (HRMMU), atualização mensal “Protection of Civilians” | **automática** (robô diário lê o PDF oficial) |
| Violência sexual documentada pela ONU | ONU · ACNUDH, relatório A/HRC/63/CRP.2 (24/02/2022–31/07/2026) | manual |
| Violência sexual registrada em investigações (mapa e série) | Procuradoria-Geral da Ucrânia, via comunicados citados pela imprensa | manual |
| Pessoas refugiadas e deslocadas internas | ACNUR (UNHCR), API pública | **automática** (consultada pelo navegador) |
| Limites das regiões | geoBoundaries / © OpenStreetMap (ODbL) | — |

Os arquivos ficam em `public/data/*.json`. Cada um traz instituição, documento, links, período, data de publicação e data de conferência.

## Como os dados se atualizam

1. **Robô diário** (`.github/workflows/update-data.yml`, 06:23 de Brasília): roda `scripts/update-data.mjs`, que
   - procura a atualização mensal mais recente da ONU, baixa o PDF e lê os números pelas coordenadas das palavras (`pdftotext -bbox`);
   - só aceita os números se **todas** as verificações baterem: soma por sexo e idade = total, soma dos meses = total, mês mais recente por sexo = linha da tabela, nenhum total caindo mais de 2%;
   - consulta a API do ACNUR;
   - quando há dado novo e válido, faz commit em `public/data/` e publica o site de novo. Se algo falhar, os últimos dados verificados permanecem e o robô registra um aviso.
2. **Página aberta**: a dashboard confere `data/manifest.json` a cada 5 minutos e, se houver dados novos, atualiza os números **sem recarregar**, marcando os cartões com o selo “Atualizado agora”. Os números do ACNUR vêm direto da API (selo “API ao vivo”); sem conexão, aparece o último dado verificado.
3. **Selos**: “Atualização recente” = fonte publicada nos últimos 60 dias; “Dado histórico” = último dado verificado disponível.

Rodar o robô manualmente: aba **Actions → Atualizar dados → Run workflow**, ou localmente (precisa do `poppler-utils`):

```bash
node scripts/update-data.mjs --dry-run
```

### Atualização manual (Procuradoria e relatório temático da ONU)

Essas fontes não têm base de dados aberta. Quando sair um número novo:

- **Procuradoria**: acrescente uma entrada em `snapshots` de `public/data/pgo-crsv.json` com data, total, vítimas do sexo feminino e masculino, menores e links. Se a divulgação trouxer **todas** as regiões, inclua `regions` (código ISO → número); o mapa passa a usá-la automaticamente.
- Depois de editar qualquer arquivo de dados, mude o campo `version` de `public/data/manifest.json` para que as páginas abertas recarreguem os dados.

## Identidade institucional (logo do SESI)

A logo fica em `public/brand/`. Para usar o PNG oficial: salve-o como `public/brand/sesi-logo.png` e troque `src` em `src/brand.ts` para `'brand/sesi-logo.png'`. A imagem é exibida com altura fixa e largura automática (sem distorção), sem alteração de cores, sobre uma base branca para funcionar nos dois temas.

## QR Code

Gerado localmente (biblioteca `uqr`, sem serviço externo). Quando o site está publicado, aponta para `fontes.html` no próprio endereço; em testes locais, para o endereço oficial. Se o site mudar de endereço, gere o build com `VITE_SITE_URL=https://novo-endereco/ npm run build`.

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # verificação de tipos + build
npm run lint
```

O mapa é pré-processado: `node scripts/build-map.mjs` baixa os limites do geoBoundaries e gera `src/data/ukraine-map.json` (projeção cônica de áreas iguais, rótulos no ponto mais interno de cada região).

## Estrutura

```
index.html, fontes.html     as duas páginas (dashboard e fontes)
public/data/                dados verificados (JSON) + manifest.json
public/brand/               logo do SESI
scripts/update-data.mjs     robô de atualização (ONU + ACNUR)
scripts/build-map.mjs       geração do mapa
src/App.tsx                 a dashboard
src/SourcesPage.tsx         página de fontes e metodologia
src/components/             contador, indicadores, mapa, linha do tempo, gráficos, QR
src/data/                   tipos, carregamento/atualização dos dados, geometria do mapa
src/index.css               cores dos temas claro e escuro
```

React · TypeScript · Vite · Tailwind CSS v4 · Recharts · Framer Motion. As cores dos gráficos foram validadas para daltonismo e contraste nos dois temas.

Cada push na `main` publica o site no GitHub Pages (`.github/workflows/deploy.yml`).
