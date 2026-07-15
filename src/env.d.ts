/// <reference path="../.astro/types.d.ts" />

// Variáveis de ambiente da integração StandVirtual (ver .env.example).
// Lidas em build-time — nunca chegam ao browser.
interface ImportMetaEnv {
  readonly SV_CLIENT_ID?: string;
  readonly SV_CLIENT_SECRET?: string;
  readonly SV_USERNAME?: string;
  readonly SV_PASSWORD?: string;
  readonly SV_SELLER_UUID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
