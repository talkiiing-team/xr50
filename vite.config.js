import { defineConfig } from "vite";
import vitejsPluginVue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vitejsPluginVue()],
  server: {
    hmr: {
      clientPort: process.env.IS_HOSTED ? 443 : 3000,
    },
  },
});
