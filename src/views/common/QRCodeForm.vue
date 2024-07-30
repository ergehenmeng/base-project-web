<template>
  <el-dialog title="二维码" v-model="showDialog" width="400px" draggable align-center :close-on-click-modal="false">
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
import dayjs from 'dayjs'

const showDialog = ref(false);

const imageData = ref({
  url: null,
  remark: null,
  text: null,
  fileName: null
});

const openDialog = ({ text, remark, fileName }) => {
  showDialog.value = true;
  imageData.value.text = text;
  imageData.value.fileName = fileName;
  generateQRCode(text).then((url) => {
    imageData.value.url = url;
    imageData.value.remark = remark;
  });
};

const handleDownload = () => {
  generateQRCode(imageData.value.text).then((data) => {
    const url = window.URL.createObjectURL(new Blob([data], { type: '.png' }));
    const link = document.createElement('a');
    link.href = url;
    const time = dayjs().format('YYYY-MM-DD HH_mm_ss');
    link.style.display = 'none';
    if (imageData.value.fileName) {
      link.download = imageData.value.fileName + time + '.png';
    } else {
      link.download = time + '.png';
    }
    link.click();
    URL.revokeObjectURL(link.href);
  });
};

const generateQRCode = (text) => {
  return QRCode.toDataURL(text, { errorCorrectionLevel: 'H' });
};

defineExpose({
  openDialog
});
</script>
