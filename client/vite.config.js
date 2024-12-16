import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// import { createProxyMiddleware } from "http-proxy-middleware";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"), // This line adds the alias for Vite
        },
    },
    server: {
        port: 5173,
        host: true,
        proxy: {
            "/tenor-api": {
                target: "https://tenor.googleapis.com/v2",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/tenor-api/, ""); },
                configure: function (proxy) {
                    proxy.on("proxyReq", function (proxyReq) {
                        proxyReq.setHeader("Origin", "https://tenor.googleapis.com");
                    });
                },
            },
        },
    },
});
