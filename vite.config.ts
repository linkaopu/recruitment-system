import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    //element-plus按需引入
    AutoImport({
      resolvers: [ElementPlusResolver({
        importStyle: false,
        })],
    }),
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: false,
        directives: true, // 👈 这一行是关键！彻底关闭指令自动导入
      })],
    }),
    
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  // 跨域代理
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端地址
        changeOrigin: true,              // 开启跨域
      }
    }
  },
})
