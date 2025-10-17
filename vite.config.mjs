// vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

export default defineConfig({
  build: { outDir: "build", chunkSizeWarningLimit: 2000 },
  plugins: [tsconfigPaths(), react(), tagger()],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    proxy: {
      // Proxy ALL /api calls to the Express backend
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        // if your backend expects /api intact, leave this true
        // if you ever mount at '/', set rewrite: p => p.replace(/^\/api/, '')
      },
    },
  },
});
