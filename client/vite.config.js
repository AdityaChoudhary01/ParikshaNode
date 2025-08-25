import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  // Add this 'resolve' block to define the '@' alias
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})