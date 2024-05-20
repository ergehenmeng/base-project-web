<template>
  <el-config-provider :locale="zhCn" size="small" :zIndex="zIndex" :value-on-clear="null" :empty-values="[undefined, null]">
  </el-config-provider>
  <!-- 默认主页 -->
  <layout />
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import layout from '@/views/Index.vue'
import { ref } from 'vue';

const zIndex = ref(2000)
</script>
