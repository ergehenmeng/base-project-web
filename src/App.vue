<template>
  <el-config-provider :locale="zhCN" :size="size" :zIndex="2000">

  </el-config-provider>

  <HelloWorld></HelloWorld>

</template>
<script >
  import { defineComponent } from 'vue'
  import { ElConfigProvider } from 'element-plus'
  import HelloWorld from './components/HelloWorld.vue'
  export default defineComponent({
    components: {
      ElConfigProvider,
    },
    setup() {
      return {
        zIndex: 3000,
        size: 'small',
      }
    }
})
</script>
