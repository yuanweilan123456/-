import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

// Ship PDF fonts/character maps from our own origin; document content never leaves the browser.
const pdfAssets = ['cmaps', 'standard_fonts', 'wasm'].flatMap((folder) =>
  readdirSync(`node_modules/pdfjs-dist/${folder}`).map((file) => ({
    name: `pdfjs/${folder}/${file}`,
    source: readFileSync(path.join('node_modules/pdfjs-dist', folder, file)),
  })),
)

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'local-pdf-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const asset = pdfAssets.find((item) => `/${item.name}` === req.url?.split('?')[0])
          if (!asset) return next()
          res.setHeader('Content-Type', asset.name.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream')
          res.end(asset.source)
        })
      },
      generateBundle() {
        for (const asset of pdfAssets) this.emitFile({ type: 'asset', fileName: asset.name, source: asset.source })
      },
    },
  ],
  server: {
    port: 5173,
  },
})
