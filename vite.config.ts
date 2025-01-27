import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        tailwindcss(),
        {
            name: 'remove-injections',
            transformIndexHtml(html, ctx) {
                if (ctx.path !== '/index-iframe.html') {
                    return
                }

                return html
                    .replace(/^.*vue-devtools-path.*$/m, '')
                    .replace(/^.*vue-inspector-path.*$/m, '')
                    .replace(/^.*@vite\/client.*$/m, '')
            },
        },
    ],
    server: {
        host: '0.0.0.0',
        cors: true,
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: resolve(__dirname, './index.html'),
                iframe: resolve(__dirname, './index-iframe.html'),
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
