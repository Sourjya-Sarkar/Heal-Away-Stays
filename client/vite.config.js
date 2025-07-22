import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // ✅ ensure proper base path for Vercel
  build: {
    outDir: "dist", // ✅ required by Vercel for Vite
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
