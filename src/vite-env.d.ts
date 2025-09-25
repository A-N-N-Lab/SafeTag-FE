/// <reference types = "vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_WS_URL?: string;
  readonly VITE_CHATBOT_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
