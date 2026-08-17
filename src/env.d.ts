/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_NEGOCIO_ID: string;
  readonly VITE_USER: string;
  readonly VITE_PASS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
