<template>
  <el-dialog v-model="showDialog" width="400px" draggable align-center :close-on-click-modal="false">
    <template #header>
      <span>{{props.title}}<QuestionTip v-if="props.tips" :content="props.tips"></QuestionTip></span>
    </template>
    <div style="text-align: center">
      <el-image fit="cover" :src="imageData.data" style="width: 70%"></el-image>
      <div>{{ imageData.remark }}</div>
    </div>
    <template #footer>
      <span>
        <el-button @click="showDialog = false" v-if="props.cancel">取消</el-button>
        <el-button type="primary" @click="handleDownload" :loading="downloadLoading" v-if="props.download">下载图片</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import QRCode from 'qrcode';
import { downloadImage } from '@/utils/common.js';
import QuestionTip from '@/components/QuestionTip.vue';

const showDialog = ref(false);
const downloadLoading = ref(false);
const emit = defineEmits(['reload']);

const props = defineProps({
  tips: {
    type: String,
    default: null
  },
  title: {
    type: String,
    required: false,
    default: '二维码'
  },
  fileName: {
    type: String,
    default: null
  },
  cancel: {
    type: Boolean,
    default: true
  },
  download: {
    type: Boolean,
    default: true
  }
});

const imageData = ref({
  data: null,
  remark: null
});

/**
 * 打开弹窗并显示二维码
 * @param text 二维码文字(二选一)
 * @param base64 二维码base64图片(二选一)
 * @param remark 备注
 */
const openDialog = ({ text, base64, remark }) => {
  showDialog.value = true;
  imageData.value.remark = remark;
  if (text) {
    generateQRCode(text).then((data) => {
      imageData.value.data = data;
    });
  } else {
    imageData.value.data = base64;
  }
};

const handleDownload = () => {
  downloadLoading.value = true;
  try {
    downloadImage(imageData.value.data?.split(',')[1], props.fileName);
  } finally {
    downloadLoading.value = false;
  }
};

const generateQRCode = (text) => {
  return QRCode.toDataURL(text, { errorCorrectionLevel: 'H' });
};

defineExpose({
  openDialog
});
</script>
