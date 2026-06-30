# Design Review: Experiência Mobile — JRcars

Reviewed against: `.design/mobile-responsive/DESIGN_BRIEF.md`
Philosophy: Premium automotive dark UI (charcoal + vermelho JR, Schibsted/Hanken Grotesk)
Date: 2026-07-01

## Screenshots Captured

| Screenshot | Breakpoint | Description |
| ---------- | ---------- | ----------- |
| `screenshots/review-home-mobile-375.png` | Mobile (375) | Página completa, layout geral |
| `screenshots/review-actionbar-mobile-375.png` | Mobile (375) | Barra de ações fixa visível após scroll |
| `screenshots/review-filters-open-mobile-375.png` | Mobile (375) | Toggle de filtros expandido |
| `screenshots/review-filters-expanded-375.png` | Mobile (375) | Filtros em coluna full-width |
| `screenshots/review-mobmenu-mobile-375.png` | Mobile (375) | Menu full-screen + botão Telefonar |
| `screenshots/review-stats-360.png` | Small (360) | Estatísticas sem overflow |
| `screenshots/review-financing-calc-375.png` | Mobile (375) | Simulador, thumbs maiores |
| `screenshots/review-contact-form-375.png` | Mobile (375) | Formulário, inputs full-width |
| `screenshots/review-locations-375.png` | Mobile (375) | Cartões de localização |
| `screenshots/review-home-small-360.png` | Small (360) | Página completa, sem scroll horizontal |
| `screenshots/review-home-tablet-768.png` | Tablet (768) | Layout intermédio |
| `screenshots/review-home-desktop-1280.png` | Desktop (1280) | **Confirmação: desktop intacto** |

> Todas em `.design/mobile-responsive/screenshots/`.

## Summary

Os problemas de "mobile terrível" do brief foram resolvidos e a experiência foi elevada acima do mínimo: header limpo, filtros recolhíveis em coluna full-width, barra de ações fixa (Telefonar + Contactar), simulador tocável e formulários sem zoom no iOS. A identidade visual mantém-se 100% e o desktop (≥1000px) está confirmadamente intacto. O build passa sem erros.

## Must Fix

_Nenhum._ Os defeitos críticos do brief foram todos corrigidos e verificados visualmente.

## Should Fix

_Nenhum bloqueante._ Todos os itens do brief estão implementados e a renderizar corretamente nas capturas.

## Could Improve

1. **Filtros no tablet (681–1000px)**: entre 681px e 1000px os filtros usam ainda o `flex-wrap` inline (não a versão recolhível). Funciona, mas o toggle full-width poderia subir para ~768px para uma transição mais coerente. _Sugestão: mover `.filters-toggle { display:flex }` e o stack para um breakpoint ≤768px._
2. **Reserva de espaço da action bar**: o `body { padding-bottom }` em mobile reserva ~64px mesmo quando a barra está oculta (topo do hero), deixando um pequeno vazio sob o footer ao ver o fim da página. Impacto mínimo (a barra está visível quando se chega ao fim). _Sugestão: aceitável como está._
3. **Quick-search do hero (2 colunas)**: a "Preço até" ocupa a linha inteira sozinha — equilibrado, mas poderia ir a 1 coluna em ecrãs ≤380px para máxima clareza.

## What Works Well

- **Barra de ações fixa** (`review-actionbar-mobile-375.png`): o padrão certo para um stand — Telefonar/Contactar sempre ao alcance do polegar, com blur e o vermelho de marca. Desliza para dentro após o hero e respeita `safe-area-inset-bottom`.
- **Filtros recolhíveis** (`review-filters-expanded-375.png`): cada controlo full-width, rótulos claros, alvos generosos. Resolve por completo o bloco irregular anterior e encurta o scroll quando recolhido.
- **Header limpo** (`review-mobmenu-mobile-375.png`): apenas logo + hambúrguer; o CTA migrou para a barra fixa. Menu full-screen com botão de chamada direto.
- **Sem zoom no iOS**: todos os selects/inputs a 16px em mobile.
- **Estatísticas sem overflow** a 360px (`review-stats-360.png`) e simulador com thumbs de toque (`review-financing-calc-375.png`).
- **Desktop preservado** (`review-home-desktop-1280.png`): zero regressões acima de 1000px.
