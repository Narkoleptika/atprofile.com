import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        vue(),
        vueDevTools(),
        tailwindcss(),
        {
            name: 'dev-unsafe-inline-style',
            transformIndexHtml(html) {
                if (mode === 'production') {
                    return
                }

                return html.replace(/style-src([^;]+);/m, "style-src$1 'unsafe-inline';")
            },
        },
    ],
    server: {
        host: '0.0.0.0',
        cors: true,
    },
    build: {
        target: 'esnext',
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
}))
