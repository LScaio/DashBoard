/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public URL of the deployed site (used by the QR code). */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
