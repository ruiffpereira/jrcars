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

Toda a informação das viaturas e da empresa está em **`src/data/cars.js`**. Edite essa lista — o catálogo, os filtros, o destaque do hero e o JSON-LD de SEO são gerados automaticamente a partir dela.
