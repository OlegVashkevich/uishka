import { defineConfig } from 'vite'
import { resolve } from 'path'


const timestamp = Date.now();

const addTimestampPlugin = () => {
  return {
    name: 'add-timestamp',
    transformIndexHtml(html) {
      // Добавляем timestamp ко всем скриптам и стилям
      return html
        .replace(/(src="[^"]*\.js")/g, `$1?t=${timestamp}`)
        .replace(/(href="[^"]*\.css")/g, `$1?t=${timestamp}`)
        .replace(/(href="[^"]*\.js")/g, `$1?t=${timestamp}`); // для modulepreload
    }
  }
}

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: 'inline',
    // Добавляем настройку для выходных файлов
    rollupOptions: {
      input: {
        // Основное приложение
        all: resolve(__dirname, 'index.html'),
        // Стили
        variables: resolve(__dirname, 'src/styles/variables.scss'),
        reset: resolve(__dirname, 'src/styles/reset.scss'),
        animations: resolve(__dirname, 'src/styles/animations.scss'),
        // Компоненты
        button: resolve(__dirname, 'src/components/button/button.js'),
        card: resolve(__dirname, 'src/components/card/card.js'),
      },
      output: {
        entryFileNames: (entryInfo) => {
          if (entryInfo.name === 'all' || entryInfo.name.includes('all')) {
            return 'all.js';
          }
          return 'components/[name].js'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'index.css') {
            return 'all.css'
          }
          if (assetInfo.name === 'variables.css') {
            return 'variables.css'
          }
          if (assetInfo.name === 'reset.css') {
            return 'reset.css'
          }
          if (assetInfo.name === 'animations.css') {
            return 'animations.css'
          }
          return 'components/[name][extname]'
        }
      }
    }
  },
  plugins: [addTimestampPlugin()],
  server: {
    port: 5173,
    host: true
  }
})