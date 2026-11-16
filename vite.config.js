import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Makes frontend accessible on mobile
    proxy: {
      "/api": {
        target: "http://192.168.192.1:5000", // Replace with your actual IPv4 address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
