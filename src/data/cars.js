// Stock de viaturas. Com o StandVirtual configurado (ver .env.example), o stock
// real do stand é carregado automaticamente em cada build a partir dos anúncios
// ativos da conta; sem configuração usa-se a lista de demonstração abaixo.
// As páginas e o JSON-LD (SEO) são geradas a partir de `cars`.
import { loadStandvirtualStock } from './standvirtual.js';

/** @type {import('./standvirtual.js').Car[]} */
const demoCars = [
  { id: 'porsche-911-carrera-s',  semi: true,  brand: 'Porsche',       name: 'Porsche 911 Carrera S', fuel: 'Gasolina', year: 2021, km: 18000, price: 118900, img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=80' },
  { id: 'bmw-m4-competition',     semi: false, brand: 'BMW',           name: 'BMW M4 Competition',    fuel: 'Gasolina', year: 2022, km: 12400, price: 96500,  img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=700&q=80' },
  { id: 'mercedes-gle-400d',      semi: false, brand: 'Mercedes-Benz', name: 'Mercedes GLE 400d',     fuel: 'Diesel',   year: 2020, km: 62000, price: 68900,  img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=700&q=80' },
  { id: 'audi-q4-etron-45',       semi: true,  brand: 'Audi',          name: 'Audi Q4 e-tron 45',     fuel: 'Elétrico', year: 2024, km: 29667, price: 44500,  img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=700&q=80' },
  { id: 'audi-rs6-avant',         semi: false, brand: 'Audi',          name: 'Audi RS6 Avant',        fuel: 'Gasolina', year: 2021, km: 31000, price: 102000, img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=700&q=80' },
  { id: 'bmw-320d-touring',       semi: false, brand: 'BMW',           name: 'BMW 320d Touring',      fuel: 'Diesel',   year: 2019, km: 78000, price: 32900,  img: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=700&q=80' },
  { id: 'mercedes-a-250e',        semi: true,  brand: 'Mercedes-Benz', name: 'Mercedes A 250 e',      fuel: 'Híbrido',  year: 2022, km: 24000, price: 38500,  img: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&q=85' },
  { id: 'vw-golf-gti',            semi: false, brand: 'Volkswagen',    name: 'VW Golf GTI',           fuel: 'Gasolina', year: 2020, km: 45000, price: 34900,  img: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=700&q=80' },
  { id: 'tesla-model-3',          semi: true,  brand: 'Tesla',         name: 'Tesla Model 3',         fuel: 'Elétrico', year: 2023, km: 19000, price: 39900,  img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=700&q=80' },
  { id: 'vw-troc-20-tdi',         semi: false, brand: 'Volkswagen',    name: 'VW T-Roc 2.0 TDI',      fuel: 'Diesel',   year: 2021, km: 54000, price: 28900,  img: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=700&q=80' },
  { id: 'bmw-ix3-m-sport',        semi: true,  brand: 'BMW',           name: 'BMW iX3 M Sport',       fuel: 'Elétrico', year: 2023, km: 21000, price: 59900,  img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=700&q=80' },
  { id: 'mercedes-c-220d',        semi: false, brand: 'Mercedes-Benz', name: 'Mercedes C 220 d',      fuel: 'Diesel',   year: 2022, km: 38000, price: 46900,  img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=700&q=80' },
];

const liveCars = await loadStandvirtualStock();
if (!liveCars) {
  console.warn('[standvirtual] Sem credenciais configuradas — a usar viaturas de demonstração (ver .env.example).');
}

export const cars = liveCars ?? demoCars;

export const brands = [...new Set(cars.map(c => c.brand))].sort();
export const fuels  = [...new Set(cars.map(c => c.fuel))].sort();

export const fmt = n => n.toLocaleString('pt-PT');

// Dados da empresa — usados em contactos e SEO (JSON-LD).
export const company = {
  name: 'JRcars',
  legalName: 'JRcars — Comércio de Automóveis',
  description: 'Stand de automóveis usados certificados em Lisboa e Porto. Viaturas nacionais com histórico comprovado, garantia mínima de 18 meses e financiamento à medida.',
  url: 'https://www.jrcars.pt',
  phone: '+351912345678',
  email: 'info@jrcars.pt',
  locations: [
    { city: 'Lisboa', street: 'Av. da Liberdade, 1250', postal: '1250-001', phone: '+351912345678', hours: 'Seg–Dom · 09h–20h' },
    { city: 'Porto',  street: 'Av. da Boavista, 4100',  postal: '4100-001', phone: '+351913456789', hours: 'Seg–Dom · 09h–20h' },
  ],
};
