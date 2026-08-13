/// <reference types="vite/client" />

/**
 * The environment the storefront reads.
 *
 * Declared rather than left to `any` because two of these decide where money
 * goes: `VITE_ADMIN_API_ORIGIN` is the app that prices the cart and starts the
 * payment, and pointing it at the wrong deployment would quietly take orders
 * into the wrong database.
 */
interface ImportMetaEnv {
  /** Where the admin app lives, e.g. https://admin.mvm-furniture.com */
  readonly VITE_ADMIN_API_ORIGIN?: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
