import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
