<template>
  <el-dialog :title="props.title" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-scrollbar max-height="350">
      <el-form :model="formData" label-position="right" label-width="auto">
        <span v-if="formData.content"> {{ formData.content }}</span>
        <el-empty :image-size="100" v-else />
      </el-form>
    </el-scrollbar>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button v-if="isSupported" type="primary" @click="copyClipboard">复制</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { useClipboard } from '@vueuse/core';
import { successMsg } from '@/utils/message.js'

const props = defineProps({
  title: {
    type: String,
    default: '详情'
  }
});

const showDialog = ref(false);
const emit = defineEmits(['reload']);
const { copy, isSupported } = useClipboard();

const formData = ref({
  content: null
});

const openDialog = (content) => {
  showDialog.value = true;
  formData.value.content = content;
};

const copyClipboard = () => {
  copy(formData.value.content);
  successMsg('复制成功')
};

defineExpose({
  openDialog
});
</script>
