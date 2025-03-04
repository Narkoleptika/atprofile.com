import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import {createViteLicensePlugin} from 'rollup-license-plugin'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        tailwindcss(),
        createViteLicensePlugin({
            additionalFiles: {
                'acknowledgements.html': (packages) => {
                    let html = '<h1>Acknowledgements</h1>\n\n'

                    html += '<ul>\n'
                    for (const pkg of packages) {
                        html += `<li>${pkg.name} ${pkg.version}<br>\n`
                        html += `<blockquote style="white-space: pre-wrap;">${pkg.licenseText}</blockquote>\n`
                        html += `</li>\n\n`
                    }
                    html += '</ul>'

                    return html
                }
            }
        })
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
})
