import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd())
  console.log('启动模式: %s 环境变量: %s', mode, env)

  return {
    // 插件注册
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: ['vue', 'vue-router'],
        resolvers: [ElementPlusResolver(), IconsResolver({
          prefix: 'Icon',
        })],
      }),
      Components({
        resolvers: [
          IconsResolver({
            enabledCollections: ['ep'],
          }),
          ElementPlusResolver()
        ]
      }),
      Icons({
        autoInstall: true,
        compiler: 'vue3',
      })
    ],
    // 在生产中服务时的基本公共路径
    base: './',
    // 解析
    resolve: {
      alias: {
        // 设置路径别名,方便快捷引入其他文件
        '@': resolve(__dirname, './src'),
        '~': resolve(__dirname, './')
      }
    },
    // json导入配置
    json: {
      // 是否支持从 .json 文件中进行按名导入
      namedExports: true,
      // 若设置为 true 导入的json会被转为 export default JSON.parse("..") 会比转译成对象字面量性能更好
      stringify: true
    },
    // 正式环境编译配置
    build: {
      // 设置最终构建的浏览器兼容目标。modules:支持原生 ES 模块的浏览器
      target: 'modules',
      // 指定输出路径
      outDir: 'dist',
      // 指定生成静态资源的存放路径
      assetsDir: 'static',
      // 则文件大小超过 assetsInlineLimit 时，文件会被作为 base64 编码插入到页面中。
      assetsInlineLimit: 4096,
      // 启用/禁用CSS代码拆分，如果禁用，整个项目的所有CSS将被提取到一个CSS文件中,默认true
      cssCodeSplit: true,
      // 构建后是否生成 source map 文件，默认false
      sourcemap: false,
      // 混淆器，terser构建后文件体积更小
      minify: 'terser',
      // 设置为 false 来禁用将构建后的文件写入磁盘(默认在内存中)
      write: true,
      // 是否清空dist目录，若outDir在root目录下Vite 会在构建时清空该目录. 默认false
      emptyOutDir: true,
      // chunk 大小警告的限制
      chunkSizeWarningLimit: 500,
      // 去除 console debugger
      terserOptions: {
        compress: {
          // 删除console
          drop_console: true,
          // 删除debugger
          drop_debugger: true
        }
      }
    },
    // 本地运行配置
    server: {
      host: '0.0.0.0',
      port: 3000,
      // 是否开启 https
      https: false,
      // 默认为true，如果为false，则不会启动服务器，只会编译。
      open: true,
      // 允许跨域
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
