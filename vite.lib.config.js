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
        sourcemap: true,
        cssCodeSplit: true,
        lib: {
            // Множественные точки входа
            entry: {
                'all': resolve(__dirname, 'src/main.js'),
                'button': resolve(__dirname, 'src/components/button/button.js'),
                //'input': resolve(__dirname, 'src/components/input/input.js'),
                //'modal': resolve(__dirname, 'src/components/modal/modal.js'),
                'card': resolve(__dirname, 'src/components/card/card.js'),
            },
            name: 'MyUI',
            formats: ['es'],
            // Формат имен файлов
            fileName: (format, entryName) => {
                if (entryName.includes('base')) {
                    return 'components/base.js'
                }
                if (entryName === 'all') {
                    return 'all.js'
                }
                return `components/${entryName}/${entryName}.js`
            }
        },
        // Добавляем настройку для выходных файлов
        rollupOptions: {
            /*input: {
                main: resolve(__dirname, 'index.html')
            },*/
            output: {
                preserveModules: true,
            }
        }
    },
    plugins: [addTimestampPlugin()],
    server: {
        port: 5173,
        host: true
    }
})