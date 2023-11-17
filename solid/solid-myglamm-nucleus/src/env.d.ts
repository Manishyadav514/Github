/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly NUCLEUS_WEBSITENODEHOST: string
    readonly NUCLEUS_APIKEY: string
    readonly NUCLEUS_ENV: string
    // more env variables can add here for suggestions 
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  