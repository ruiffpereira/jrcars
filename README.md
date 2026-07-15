# JRcars — Website (Astro)

Website de venda de automóveis usados certificados, construído em **Astro** com foco em **SEO** e **acessibilidade**.

## Pré-requisitos
- [Node.js](https://nodejs.org/) v18.14 ou superior

## Instalar e correr

```bash
cd jrcars-astro
npm install
npm run dev
```

Abre em `http://localhost:4321`.

## Build para produção

```bash
npm run build      # gera /dist (HTML estático, ultra-rápido)
npm run preview    # pré-visualiza o build
```

O `/dist` resultante é estático e pode ser publicado em qualquer alojamento (Netlify, Vercel, Cloudflare Pages, ou um servidor normal).

## SEO incluído

- **Meta tags** completas (título, descrição, keywords, canonical, theme-color)
- **Open Graph** + **Twitter Cards** para partilhas
- **JSON-LD / Schema.org** — `AutoDealer` com as duas localizações + `ItemList` de viaturas (`Car` + `Offer`), para resultados ricos no Google
- **Sitemap** automático (`@astrojs/sitemap`) e **robots.txt**
- **HTML semântico** renderizado no servidor — todo o catálogo é indexável
- `lang="pt-PT"`, imagens com `width`/`height` e `loading="lazy"`

> Antes de publicar, altere o domínio em `astro.config.mjs` (`site`) e em `public/robots.txt`.

## Acessibilidade incluída

- **Skip link** ("Saltar para as viaturas")
- **Labels** associadas a todos os campos (filtros, simulador, contacto)
- **ARIA**: `aria-label`, `aria-expanded`, `aria-live`, `role="dialog"` no menu mobile
- **Foco visível** (`:focus-visible`) e fecho do menu com `Esc`
- **`prefers-reduced-motion`** — desativa animações para quem o prefere
- Texto alternativo em todas as imagens

## Estrutura

```
jrcars-astro/
├── astro.config.mjs        # config + sitemap + domínio
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── data/cars.js        # ← edite aqui as viaturas e dados da empresa
    ├── styles/global.css
    ├── layouts/Layout.astro
    ├── components/
    │   ├── SEO.astro       # meta tags + JSON-LD
    │   ├── Nav.astro
    │   ├── Hero.astro
    │   ├── Trust.astro
    │   ├── Catalog.astro
    │   ├── Financing.astro
    │   ├── Services.astro
    │   ├── About.astro
    │   ├── Contact.astro
    │   └── Footer.astro
    └── pages/index.astro   # página + lógica de interação
```

## Gerir o catálogo

Toda a informação das viaturas e da empresa está em **`src/data/cars.js`** — o catálogo, os filtros, o destaque do hero e o JSON-LD de SEO são gerados automaticamente a partir dela.

**Com o StandVirtual configurado (abaixo), a lista de viaturas passa a vir automaticamente dos anúncios ativos do stand** e a lista manual de `cars.js` serve apenas de demonstração/fallback quando não há credenciais.

## Stock automático via StandVirtual

Em cada `npm run build`, o site vai buscar os anúncios **ativos** da conta do stand no StandVirtual (`src/data/standvirtual.js`) e gera o catálogo com eles: nome, preço, ano, quilómetros, combustível, badge Seminovo/Usado e fotos (CDN do StandVirtual).

### Configurar (copiar `.env.example` para `.env`)

Há duas opções — basta uma:

| Opção | Variáveis | Como obter |
|-------|-----------|-----------|
| **A. API oficial** (recomendada) | `SV_CLIENT_ID`, `SV_CLIENT_SECRET`, `SV_USERNAME`, `SV_PASSWORD` | Pedir `client_id`/`client_secret` por email a **api@standvirtual.com** (exclusivo de contas profissionais). Username/password são o login normal da conta. Docs: [standvirtual.com/api/doc](https://www.standvirtual.com/api/doc/) |
| **B. Inventário público** | `SV_SELLER_UUID` | Funciona já hoje, sem pedir nada: é o UUID público do vendedor. Abrir um anúncio do stand, ver o código-fonte e procurar `sellerUUID`. Serve também de fallback automático da opção A. |

Comportamento em caso de falha: se houver credenciais configuradas e o StandVirtual não responder, **o build falha de propósito** — o site publicado mantém o último stock real em vez de mostrar um catálogo vazio ou de demonstração.

### Atualização automática

Como o site é estático, o stock só muda quando há novo build. O workflow [`.github/workflows/atualizar-stock.yml`](.github/workflows/atualizar-stock.yml) dispara o build hook do alojamento 4x/dia:

1. Publicar o site num alojamento com build hooks (Netlify, Vercel ou Cloudflare Pages) e configurar aí as variáveis `SV_*`.
2. Criar um *build hook* no painel do alojamento e guardar o URL como secret **`DEPLOY_HOOK_URL`** no repositório GitHub (Settings → Secrets and variables → Actions).
3. (Opcional) Ajustar o horário no `cron` do workflow.

Alternativa sem GitHub Actions: agendar o build diretamente no alojamento (ex.: Netlify Scheduled Builds) ou correr `npm run build` + deploy num cron de um servidor próprio.
