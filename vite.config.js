import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/grants-gov": {
        target: "https://api.grants.gov",
        changeOrigin: true,
        rewrite: () => "/v1/api/search2"
      }
    }
  }
});
