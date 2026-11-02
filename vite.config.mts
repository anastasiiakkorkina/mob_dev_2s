import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Forward browser API requests to the local-only Node service during development.
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        vanilla: "index.html",
        react: "react.html",
        demo4: "react/demo4.html",
      },
    },
  },
});
