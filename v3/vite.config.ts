import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const wakatimeApiKey = env.WAKATIME_API_KEY || process.env.WAKATIME_API_KEY;
  const authHeader = wakatimeApiKey
    ? `Basic ${Buffer.from(`${wakatimeApiKey}:`).toString("base64")}`
    : undefined;

  return {
    base: "/",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api/wakatime": {
          target: "https://wakatime.com",
          changeOrigin: true,
          rewrite: () => "/api/v1/users/current/stats/last_7_days",
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (authHeader) proxyReq.setHeader("Authorization", authHeader);
            });
          },
        },
      },
    },
  };
});
