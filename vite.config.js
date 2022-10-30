import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server:{
    host:"localhost",
    port:5173,
    open:false,
    https:false,
    proxy:{
      "/api":"http://localhost:8082"
    }
  }
})
