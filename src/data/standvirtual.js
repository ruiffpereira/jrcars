// Integração StandVirtual — carrega o stock real do stand em build-time.
//
// Duas fontes, tentadas por esta ordem:
//   1. API oficial (conta profissional) — precisa de SV_CLIENT_ID, SV_CLIENT_SECRET,
//      SV_USERNAME e SV_PASSWORD. As credenciais pedem-se a api@standvirtual.com.
//      Docs: https://www.standvirtual.com/api/doc/
//   2. Inventário público do stand (GraphQL, o mesmo que alimenta
//      https://{stand}.standvirtual.com/inventory) — só precisa de SV_SELLER_UUID.
//      Endpoint não documentado: pode mudar sem aviso, daí ser o caminho secundário.
//
// Sem variáveis configuradas devolve null (o site usa os dados de demonstração).
// Com variáveis configuradas mas fetch falhado, LANÇA erro de propósito: num site
// estático é preferível o build falhar (fica no ar o último stock real publicado)
// do que publicar um catálogo vazio ou errado.

const SV_BASE = 'https://www.standvirtual.com';
const CATEGORY_CARS = 29;
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

// Funciona no build do Astro (import.meta.env) e em Node puro (process.env).
const env = (key) => import.meta.env?.[key] ?? process.env?.[key];

const FUEL_PT = {
  petrol: 'Gasolina',
  gasoline: 'Gasolina',
  gaz: 'Gasolina',
  diesel: 'Diesel',
  electric: 'Elétrico',
  hybrid: 'Híbrido',
  'plugin-hybrid': 'Híbrido',
  'petrol-hybrid': 'Híbrido',
  'diesel-hybrid': 'Híbrido',
  'petrol-lpg': 'GPL',
  lpg: 'GPL',
  'petrol-cng': 'GNC',
  cng: 'GNC',
  hydrogen: 'Hidrogénio',
};

const BRAND_LABEL = {
  bmw: 'BMW',
  'mercedes-benz': 'Mercedes-Benz',
  mercedes: 'Mercedes-Benz',
  vw: 'Volkswagen',
  seat: 'SEAT',
  cupra: 'CUPRA',
  skoda: 'Škoda',
  citroen: 'Citroën',
  'ds-automobiles': 'DS',
  ds: 'DS',
  'alfa-romeo': 'Alfa Romeo',
  'land-rover': 'Land Rover',
  'aston-martin': 'Aston Martin',
  'rolls-royce': 'Rolls-Royce',
  mini: 'MINI',
  mg: 'MG',
  byd: 'BYD',
  kgm: 'KGM',
};

const capitalize = (w) => (w ? w[0].toUpperCase() + w.slice(1) : w);

const brandLabel = (slug) => {
  const s = String(slug ?? '').toLowerCase();
  return BRAND_LABEL[s] ?? s.split('-').map(capitalize).join(' ');
};

const fuelLabel = (slug) => {
  const s = String(slug ?? '').toLowerCase();
  return FUEL_PT[s] ?? capitalize(s);
};

// Badge "Seminovo": viatura nova ou recente com poucos km (km=0 significa
// quilometragem desconhecida, não carro novo — não conta como seminovo).
const isSemi = (newUsed, year, km) =>
  newUsed === 'new' || (Number(year) >= new Date().getFullYear() - 2 && Number(km) > 0 && Number(km) <= 30000);

// As fotos do CDN (apollo.olxcdn.com) aceitam um sufixo ";s=LxA" de redimensionamento.
const photoAtSize = (url, size) => {
  if (typeof url !== 'string' || !url) return undefined;
  if (url.includes(';s=')) return url.replace(/;s=\d+x\d+/, `;s=${size}`);
  return `${url};s=${size}`;
};

async function fetchJson(url, options, tries = 2) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
      return await res.json();
    } catch (err) {
      if (attempt >= tries) throw err;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
}

// --- Fonte 1: API oficial -------------------------------------------------

// O preço oficial vem num formato peculiar: { "0": "price", "1": 40000, "currency": "EUR", ... }
const officialPrice = (v) => (Array.isArray(v) ? v[1] : v && typeof v === 'object' ? v['1'] : v);

function mapOfficialAdvert(ad) {
  const p = ad.params ?? {};
  const rawPrice = officialPrice(p.price);
  const photoSets = ad.photos
    ? Object.keys(ad.photos)
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => ad.photos[k])
    : [];
  const first = photoSets[0] ?? {};
  const year = Number(p.first_registration_year) || undefined;
  const km = Number(p.mileage) || 0;
  return {
    id: `sv-${ad.id}`,
    semi: isSemi(ad.new_used, year, km),
    brand: brandLabel(p.make),
    name: String(ad.title ?? '').trim() || [brandLabel(p.make), p.model, p.version].filter(Boolean).join(' '),
    fuel: fuelLabel(p.fuel_type),
    year,
    km,
    price: Math.round(Number(rawPrice)) || 0,
    img: first['732x488'] ?? Object.values(first)[0],
    imgLarge: first['1080x720'] ?? first['1280x800'],
    url: ad.url,
    createdAt: ad.created_at ?? '',
  };
}

async function fetchOfficial({ clientId, clientSecret, username, password }) {
  // Desde 2022-08-01 todos os pedidos têm de levar User-Agent (o email da conta).
  const token = await fetchJson(`${SV_BASE}/api/open/oauth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': username },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      username,
      password,
    }).toString(),
  });
  if (!token?.access_token) throw new Error('OAuth sem access_token na resposta');

  const headers = {
    Authorization: `Bearer ${token.access_token}`,
    'User-Agent': username,
    'Content-Type': 'application/json',
  };
  const adverts = [];
  const pageLimit = 50;
  for (let page = 1, isLast = false; !isLast && page <= 40; page++) {
    const data = await fetchJson(`${SV_BASE}/api/open/account/adverts?limit=${pageLimit}&page=${page}`, { headers });
    const results = data.results ?? [];
    adverts.push(...results);
    // Pára quando a API diz explicitamente que é a última página OU a página
    // vem incompleta — nunca por o campo is_last_page vir ausente/null.
    isLast = data.is_last_page === true || results.length < pageLimit;
  }
  return adverts
    .filter((ad) => ad.status === 'active' && Number(ad.category_id) === CATEGORY_CARS)
    .map(mapOfficialAdvert);
}

// --- Fonte 2: inventário público (GraphQL) --------------------------------

const INVENTORY_QUERY = `query getBusinessSiteInventory($input: PublishedAdsInput!) {
  publishedAds(input: $input) {
    ... on PublishedAdsOutput {
      total
      pageInfo { offset limit }
      ads {
        id title url createdAt photos(limit: 1)
        price { ... on AdNetGrossPrice { currencyCode grossMinorAmount isNet } }
        attributes { key value valueLabel valueSuffix }
      }
    }
  }
}`;

function mapPublishedAd(ad) {
  const attr = Object.fromEntries((ad.attributes ?? []).map((a) => [a.key, a]));
  const year = Number(attr.first_registration_year?.value) || undefined;
  const km = Number(attr.mileage?.value) || 0;
  const photo = (ad.photos ?? [])[0];
  return {
    id: `sv-${ad.id}`,
    semi: isSemi(null, year, km),
    brand: attr.make?.valueLabel ?? brandLabel(attr.make?.value),
    name: String(ad.title ?? '').trim(),
    fuel: attr.fuel_type?.valueLabel ?? fuelLabel(attr.fuel_type?.value),
    year,
    km,
    price: Math.round((ad.price?.grossMinorAmount ?? 0) / 100),
    img: photoAtSize(photo, '732x488'),
    imgLarge: photoAtSize(photo, '1080x720'),
    url: ad.url,
    createdAt: ad.createdAt ?? '',
  };
}

async function fetchPublicInventory(sellerUuid) {
  const ads = [];
  const limit = 30;
  for (let offset = 0; offset < 3000; offset += limit) {
    const data = await fetchJson(`${SV_BASE}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': BROWSER_UA },
      body: JSON.stringify({
        query: INVENTORY_QUERY,
        variables: {
          input: {
            filter: [
              { field: 'user_uuid', operator: 'eq', value: sellerUuid },
              { field: 'category_id', operator: 'eq', value: String(CATEGORY_CARS) },
            ],
            order: [{ name: 'created_at', sort: 'DESC' }],
            pagination: { offset, limit },
          },
        },
      }),
    });
    const out = data?.data?.publishedAds;
    if (!out || !Array.isArray(out.ads)) {
      throw new Error(`resposta inesperada do GraphQL: ${JSON.stringify(data?.errors ?? data).slice(0, 300)}`);
    }
    ads.push(...out.ads);
    // Página incompleta = última; `total` (quando presente) é só atalho.
    if (out.ads.length < limit) break;
    if (out.total != null && ads.length >= out.total) break;
  }
  return ads.map(mapPublishedAd);
}

// --- Entrada única ----------------------------------------------------------

function finish(cars, source) {
  const valid = cars.filter((c) => c.name && c.price > 0 && c.img);
  const dropped = cars.length - valid.length;
  if (dropped > 0) console.warn(`[standvirtual] ${dropped} anúncio(s) ignorado(s) por falta de preço ou foto.`);
  // 0 viaturas válidas conta como falha da fonte: nunca publicar catálogo vazio.
  if (valid.length === 0) {
    throw new Error(`0 anúncios de carros válidos via ${source} (conta sem anúncios ativos, ou todos sem preço/foto?)`);
  }
  valid.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  console.log(`[standvirtual] ${valid.length} viaturas carregadas via ${source}.`);
  return valid;
}

/**
 * @typedef {Object} Car
 * @property {string} id
 * @property {boolean} semi
 * @property {string} brand
 * @property {string} name
 * @property {string} fuel
 * @property {number} [year]
 * @property {number} km
 * @property {number} price
 * @property {string} img
 * @property {string} [imgLarge]
 * @property {string} [url]
 * @property {string} [createdAt]
 */

/**
 * Devolve o stock real do StandVirtual, ou null se nenhuma credencial estiver
 * configurada. Lança erro se estiver configurado e todas as fontes falharem.
 * @returns {Promise<Car[] | null>}
 */
export async function loadStandvirtualStock() {
  const clientId = env('SV_CLIENT_ID');
  const clientSecret = env('SV_CLIENT_SECRET');
  const username = env('SV_USERNAME');
  const password = env('SV_PASSWORD');
  const sellerUuid = env('SV_SELLER_UUID');
  const hasOfficial = Boolean(clientId && clientSecret && username && password);

  if (!hasOfficial && !sellerUuid) return null;

  const errors = [];
  if (hasOfficial) {
    try {
      return finish(await fetchOfficial({ clientId, clientSecret, username, password }), 'API oficial');
    } catch (err) {
      errors.push(`API oficial: ${err.message}`);
    }
  }
  if (sellerUuid) {
    try {
      return finish(await fetchPublicInventory(sellerUuid), 'inventário público');
    } catch (err) {
      errors.push(`inventário público: ${err.message}`);
    }
  }
  throw new Error(
    `[standvirtual] Falha ao obter o stock (${errors.join(' · ')}). ` +
      'Build interrompido para não publicar um catálogo errado — o site publicado mantém o último stock.'
  );
}
