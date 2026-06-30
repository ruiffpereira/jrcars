# Design Brief: Experiência Mobile — JRcars

> Âmbito: corrigir e elevar a experiência **mobile/tablet** do site JRcars (Astro SSG, single-page). O desktop fica **intacto**. Identidade visual mantida a 100%.

## Problem

No telemóvel — onde a maioria dos compradores de carros realmente navega — o site está "terrível". Os problemas observados no código confirmam a queixa:

- O topo fica **entulhado**: o botão vermelho "Contactar" nunca é escondido, por isso convive com o hambúrguer num espaço apertado.
- Os **filtros do catálogo** (5 dropdowns + "Limpar") usam `flex-wrap` com `min-width:150px` e **não têm regra mobile** — colapsam num bloco irregular e feio.
- Todos os campos de formulário/select têm `< 16px` → o **Safari iOS faz zoom automático** ao tocar, deslocando o layout.
- As **estatísticas** são forçadas a 3 colunas a ≤680px com números de 38px → "2.500" transborda em ecrãs pequenos.
- **Alvos de toque** demasiado pequenos: `☰` e `✕` são glifos sem padding (~22px, abaixo dos 44px recomendados).
- Existem apenas **2 breakpoints grosseiros** (1000px, 680px) — nada entre tablet e telemóvel pequeno; espaçamentos de secção (84px) e heros pesados não estão afinados para mobile.

O resultado: num telemóvel o site parece partido, difícil de usar, e o caminho para o contacto (o objetivo de negócio) está enterrado.

## Solution

Uma camada responsiva completa e afinada que faz o mesmo conteúdo e a mesma identidade funcionarem com qualidade de produto no telemóvel: header limpo, filtros em coluna utilizáveis com o polegar, formulários sem zoom acidental, espaçamento e tipografia calibrados por breakpoint, e uma **barra de ações fixa** que mantém "Telefonar" e "Contactar" sempre ao alcance — porque comprar um carro começa com um contacto.

## Experience Principles

1. **Polegar primeiro, não rato encolhido** — Tudo o que se toca tem ≥44px e cabe na zona alcançável; o mobile não é o desktop espremido.
2. **Caminho para o contacto sempre visível** — Num site de stand, a ação de maior valor (ligar/contactar) nunca deve estar a mais de um toque de distância.
3. **Mesma alma, outro corpo** — Zero alterações à identidade (cores, fontes, tom). Só muda a forma como o layout respira em cada largura.

## Aesthetic Direction

- **Philosophy**: Premium automotive dark UI — charcoal profundo, vermelho de marca como acento decisivo, cartões com bordas subtis. (Mantido tal como está.)
- **Tone**: Confiante, sério, transparente.
- **Reference points**: Os próprios componentes desktop existentes — são a fonte da verdade.
- **Anti-references**: Layout "desktop encolhido"; filtros em fila que partem; texto que obriga a zoom; CTAs perdidos no scroll.

## Existing Patterns

- **Typography**: `--disp: 'Schibsted Grotesk'` (títulos), `--sans: 'Hanken Grotesk'` (corpo). Base 15px / line-height 1.65. Títulos com `clamp()` por `vw`.
- **Colors**: `--bg #14161a`, `--bg2 #1b1e24`, `--bg3 #22262e`, `--red #E1142E`, `--text #F3F4F6`, `--muted #9aa0aa`. Linhas `rgba(255,255,255,.09/.14)`.
- **Spacing**: `.wrap` max-width 1320px, padding 40px (→ 20px a ≤680px). `section { padding: 84px 0 }` (→ 60px a ≤680px). Raio base `--r: 12px`.
- **Components**: Nav + mob-menu, Hero (grid + quick-search), Trust (4-col), Catalog (filtros + grid 3-col), Financing (simulador com sliders), Services (3-col), About (stats), Contact (locais + form), Footer. Tudo em `src/styles/global.css` + componentes `.astro`.

## Component Inventory

| Component | Status | Notes |
| --------- | ------ | ----- |
| Header / Nav | Modify | Esconder `.nav-cta` no topo em mobile; aumentar alvo do hambúrguer (≥44px, com padding). |
| Mob-menu | Modify | Alvo de fecho ≥44px; adicionar ações de contacto (telefone) dentro do menu. |
| **Sticky action bar** | **New** | Barra fixa no fundo (só mobile): Telefonar + Contactar. Respeita `safe-area-inset-bottom`. Aparece após scroll do hero. |
| Hero quick-search | Modify | Grid mobile coerente (1 col em ecrãs pequenos), selects ≥16px, botão full-width. |
| Trust | Keep/verify | Já vai a 2-col; confirmar bordas/padding em mobile. |
| Catalog filters | Modify | **Stack em coluna full-width** em mobile; selects ≥16px; "Limpar" como linha própria. Considerar `<details>` recolhível. |
| Catalog grid | Keep | Já vai a 1 col a ≤680px; confirmar imagem/spacing. |
| Financing | Modify | Sliders com thumb ≥24px (toque); `fin-total` escala em mobile; padding afinado. |
| Services | Keep | 3→1 col já existe; confirmar. |
| About / stats | Modify | Stats **não** forçar 3-col; permitir 1-col empilhado ou reduzir número; evitar overflow. |
| Contact | Modify | Inputs ≥16px (já 14.5 → subir); `loc-meta` confirmar wrap. |
| Footer | Keep | Já faz wrap. Adicionar espaço inferior p/ não colidir com a action bar. |

## Key Interactions

- **Sticky action bar**: oculta no topo do hero; ao fazer scroll para além do hero, desliza para dentro a partir do fundo (transform/opacity). "Telefonar" usa `tel:`; "Contactar" faz smooth-scroll para `#contacto`. Esconde-se ou fica abaixo do mob-menu quando este abre.
- **Filtros mobile**: em coluna, cada controlo full-width e tocável; mudança aplica filtro imediatamente (comportamento JS já existe). Opcional: recolher os filtros atrás de um toggle "Filtrar" para encurtar o scroll.
- **Mob-menu**: abre full-screen (já existe); fecho com alvo maior; foco gerido; `Esc` fecha (já existe).
- **Formulários/selects**: font-size ≥16px para eliminar o zoom do iOS; estados de foco com a borda vermelha mantidos.

## Responsive Behavior

Refinar a escada de breakpoints (mobile-first em espírito, mantendo o CSS atual):

- **≥1000px**: desktop atual — **sem alterações**.
- **640–1000px (tablet)**: heros/grids a 1–2 col (já existe); afinar paddings e a barra de filtros.
- **≤640px (telemóvel)**: filtros em coluna full-width; quick-search compacto; stats sem overflow; `section` padding reduzido; action bar visível; `.wrap` padding 20px (já existe) — confirmar 16px em ecrãs muito estreitos (≤380px).
- **≤380px (telemóvel pequeno)**: garantir que nada transborda; reduzir tipografia de números grandes (`fin-total`, `stat-n`) e o padding do hero.

Componentes que **mudam de comportamento** (não só de tamanho): filtros (fila→coluna/recolhível), CTA (header→barra fixa), nav (links→hambúrguer, já existe).

## Accessibility Requirements

- Alvos de toque interativos ≥ 44×44px (hambúrguer, fechar, botões da action bar, selects).
- Contraste de texto ≥ 4.5:1 (manter `--text`/`--muted` sobre os fundos; verificar `--muted2` em elementos pequenos).
- Foco visível mantido (`:focus-visible` a vermelho já existe) e ordem de tabulação lógica com a nova action bar.
- `prefers-reduced-motion` respeitado (já existe) — incluir a animação da action bar nessa exceção.
- Form controls ≥16px para evitar zoom forçado (também é uma melhoria de legibilidade).
- A action bar não deve tapar conteúdo: adicionar `padding-bottom` ao final da página / `scroll-margin` aos âncoras.

## Out of Scope

- Qualquer alteração ao **layout desktop** (≥1000px).
- Mudanças de **identidade**: cores, fontes, tom, copy.
- Novas **secções/conteúdo** ou novas viaturas/dados.
- Backend, formulário real de submissão, integrações.
- Página de detalhe de viatura (o site é single-page; "Detalhes" continua a levar ao contacto).
