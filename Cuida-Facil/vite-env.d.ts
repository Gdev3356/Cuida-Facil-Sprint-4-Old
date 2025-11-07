/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Declare aqui a variável VITE_ que está causando o erro
  readonly VITE_API_URL_BASE: string
  // Você pode adicionar outras variáveis VITE_ aqui se precisar
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}