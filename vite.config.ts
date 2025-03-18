import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // this fixes the errors related to this picture => https://github.com/user-attachments/assets/ea45dc6e-b791-4b49-927d-b9bff60d2bbb
  // package.nls.json and dark_modern.json not found (404)
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
          importMetaUrlPlugin
      ]
    }
  }
})
