<template>
  <el-config-provider :locale="zhCn" :zIndex="zIndex" :value-on-clear="null" :empty-values="[undefined, null]">
    <layout />
  </el-config-provider>

</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import layout from '@/views/index.vue';
import { ref } from 'vue';

const zIndex = ref(3000)
</script>
