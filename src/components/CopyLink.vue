<template>
  <el-button v-if="isSupported" :icon="DocumentCopy" @click="copyClipboard" link ></el-button>
</template>
<script setup>
import { DocumentCopy } from '@element-plus/icons-vue'
import { successMsg } from '@/utils/message.js'
import { useClipboard } from '@vueuse/core'
const { copy, isSupported } = useClipboard();

const props = defineProps({
  content: {
    type: String,
    required: false
  },
});

const copyClipboard = () => {
  copy(props.content);
  successMsg('复制成功');
};
</script>