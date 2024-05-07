<template>
  <el-config-provider :locale="zhCn" :size="size" :zIndex="zIndex">

  </el-config-provider>

  <HelloWorld></HelloWorld>

</template>
<script >
  import { defineComponent } from 'vue'
  import { ElConfigProvider } from 'element-plus'
  import HelloWorld from '@/components/HelloWorld.vue'
  import { zhCn } from 'element-plus/es/locales.mjs'

  // 设置Element Plus全局配置
  export default defineComponent({
    components: {
      ElConfigProvider,
    },
    setup() {
      return {
        zIndex: 2000,
        size: 'small',
        // 中文显示
        zhCn: zhCn,
      }
    }
})
</script>
