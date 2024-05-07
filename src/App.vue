<template>
  <el-config-provider :locale="local" :size="size" :zIndex="zIndex">

  </el-config-provider>

  <HelloWorld></HelloWorld>

</template>
<script >
  import { defineComponent } from 'vue'
  import { ElConfigProvider } from 'element-plus'
  import HelloWorld from '~/components/HelloWorld.vue'
  import zhCn from 'element-plus/es/locale/lang/zh-cn'

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
        local: zhCn,
      }
    }
})
</script>
