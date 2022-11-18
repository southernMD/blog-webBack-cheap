import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // ...
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        charset: false,
        javascriptEnabled: true,
        // 这样就能全局使用 src/assets/styles/mixins.less 定义的 变量
        additionalData: `@import "${path.resolve('./src/assets/mixins.less')}";`
      },
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})

