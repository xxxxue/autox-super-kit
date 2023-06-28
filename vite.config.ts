import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import initAutoxBridge from './plugins/init-autox-bridge';
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
  plugins: [
    react(),
    initAutoxBridge(),
    viteSingleFile(),
  ],
 
})
