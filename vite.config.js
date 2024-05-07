import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [AutoImport({
    resolvers: [ElementPlusResolver()],
  }), Components({
    resolvers: [ElementPlusResolver()],
  }), vue()],
  resolve: {
    alias: {
      // 设置路径别名,方便快捷引入其他文件
      '@': resolve(__dirname, "./src")
    }
  }
})
