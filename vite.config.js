import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Vercel serves from the domain root. A subpath base (e.g. '/Infinova-Hackathon/'
  // for GitHub Pages project sites) makes every asset 404 and renders a blank page.
  base: '/',
  plugins: [react(), tailwindcss()],
})
