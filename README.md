# JRcars — Website React + Vite

Website premium de venda e importação de automóveis.

## Pré-requisitos
- [Node.js](https://nodejs.org/) v18 ou superior

## Instalar e correr

```bash
# 1. Entrar na pasta
cd jrcars-react

# 2. Instalar dependências
npm install

# 3. Arrancar em modo desenvolvimento
npm run dev
```

Abre `http://localhost:5173` no browser.

## Fazer build para produção

```bash
npm run build
# Ficheiros prontos em /dist
```

## Estrutura do projeto

```
jrcars-react/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx          # Entry point
    ├── App.jsx           # Componente raiz
    ├── index.css         # CSS global + variáveis
    └── components/
        ├── Nav.jsx / Nav.module.css
        ├── Hero.jsx / Hero.module.css
        ├── Catalog.jsx / Catalog.module.css
        ├── ImportCalc.jsx / ImportCalc.module.css
        ├── About.jsx / About.module.css
        ├── Contact.jsx / Contact.module.css
        └── Footer.jsx / Footer.module.css
```

## Personalizar

- **Carros:** editar array `CARS` em `src/components/Catalog.jsx`
- **Cores:** variáveis `--red`, `--bg`, `--cream` em `src/index.css`
- **Textos e contactos:** editar directamente em cada componente
- **Cálculo ISV:** lógica em `src/components/ImportCalc.jsx` → função `calculate()`
