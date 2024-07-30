<template>
  <el-dialog title="二维码" v-model="showDialog" width="400px" draggable align-center :close-on-click-modal="false">
    <template #header>
      <span>二维码<QuestionTip v-if="props.tips" :content="props.tips"></QuestionTip></span>
    </template>
    <div style="text-align: center">
      <el-image fit="cover" :src="imageData.url" style="width: 70%"></el-image>
      <div>{{ imageData.remark }}</div>
    </div>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleDownload">下载图片</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import QRCode from 'qrcode';
import {downloadImage} from "@/utils/common.js";
import QuestionTip from "@/components/QuestionTip.vue";

const showDialog = ref(false);

const props = defineProps({
  tips: {
    type: String,
    default: null
  },
  fileName: {
    type: String,
    default: null
  }
 })

const imageData = ref({
  url: null,
  remark: null,
  text: null
});

const openDialog = ({ text, remark }) => {
  showDialog.value = true;
  imageData.value.text = text;
  generateQRCode(text).then((url) => {
    imageData.value.url = url;
    imageData.value.remark = remark;
  });
};

const handleDownload = () => {
  generateQRCode(imageData.value.text).then((data) => {
    downloadImage(data.split(',')[1], props.fileName);
  });
};

const generateQRCode = (text) => {
  return QRCode.toDataURL(text, { errorCorrectionLevel: 'H' });
};

defineExpose({
  openDialog
});
</script>
