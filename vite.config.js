import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {
  console.log("开发模式: %s", mode)
  var env = loadEnv(mode, process.cwd(), 'VITE_')
  console.log("读取到的环境变量: %s", env)
  return {
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
  }
})
