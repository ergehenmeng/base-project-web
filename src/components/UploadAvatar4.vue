<template>
  <el-dialog title="头像上传" v-model="showDialog" width="600px" draggable align-center :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row>
      <el-col :span="12" style="height: 200px">
        <div class="cropper-upload-box">
          <CropperCanvas background key="contain" ref="cropperRef">
            <CropperImage ref="cropperImgRef"  rotatable scalable skewable translatable></CropperImage>
            <CropperShade class="cropper-shade"></CropperShade>
            <CropperHandle action="move" plain></CropperHandle>
            <CropperSelection movable resizable outlined :aspectRatio="1" id="cropperSelected" @change="cropperSelectedChangeHandle">
              <CropperCrosshair centered />
              <CropperHandle class="select-handle-move" action="move" />
              <CropperHandle action="n-resize" />
              <CropperHandle action="e-resize" />
              <CropperHandle action="s-resize" />
              <CropperHandle action="w-resize" />
              <CropperHandle action="ne-resize" />
              <CropperHandle action="nw-resize" />
              <CropperHandle action="se-resize" />
              <CropperHandle action="sw-resize" />
            </CropperSelection>
          </CropperCanvas>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="cropper-preview-box">
          <CropperViewer selection="#cropperSelected" ></CropperViewer>
        </div>
      </el-col>
    </el-row>
    <el-row  style="margin-top: 15px">
      <el-col :span="4">
        <el-upload action="#" :http-request="() => {}" :before-upload="beforeUpload" :show-file-list="false">
          <el-button plain type="primary">上传</el-button>
        </el-upload>
      </el-col>
      <el-col :span="3" :offset="2">
        <el-button :icon="Plus" circle @click="changeScale(1)"></el-button>
      </el-col>
      <el-col :span="3">
        <el-button :icon="Minus" circle @click="changeScale(-1)"></el-button>
      </el-col>
      <el-col :span="3">
        <el-button :icon="RefreshLeft" circle @click="rotateLeft()"></el-button>
      </el-col>
      <el-col :span="3">
        <el-button :icon="RefreshRight" circle @click="rotateRight()"></el-button>
      </el-col>
      <el-col :span="3" :offset="3">
        <el-button type="primary" @click="handleUpload">上传</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script setup>
import 'cropperjs';
import { getCurrentInstance, reactive } from 'vue';
import { Minus, Plus, RefreshLeft, RefreshRight } from '@element-plus/icons-vue';
import { errorMsg } from '@/utils/message.js';
import { CropperCanvas, CropperImage, CropperShade, CropperHandle, CropperSelection, CropperCrosshair, CropperViewer } from 'cropperjs';

const { proxy } = getCurrentInstance();
const cropperRef = ref();
const cropperImgRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['confirm']);
const imgBlob = ref();

const cropperSelectedChangeHandle = (event) => {
  const cropperCanvas = this.$refs.cropperCanvas;
  if (!cropperCanvas) {
    return;
  }
  const cropperImage = this.$refs.cropperImage;
  const cropperImageRect = cropperImage.getBoundingClientRect();
  const cropperCanvasRect = cropperCanvas.getBoundingClientRect();
  const selection = event.detail
  const maxSelection = {
    x: cropperImageRect.left - cropperCanvasRect.left,
    y: cropperImageRect.top - cropperCanvasRect.top,
    width: cropperImageRect.width,
    height: cropperImageRect.height,
  };

  if (!inSelection(selection, maxSelection)) {
    event.preventDefault();
  }
}

const inSelection = (selection, maxSelection) => {
  return (
    selection.x >= maxSelection.x
    && selection.y >= maxSelection.y
    && (selection.x + selection.width) <= (maxSelection.x + maxSelection.width)
    && (selection.y + selection.height) <= (maxSelection.y + maxSelection.height)
  );
}

const beforeUpload = (rawFile) => {
  if (rawFile.type.indexOf('image/') === -1) {
    errorMsg('请上传图片类型文件!')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    errorMsg('文件大小不能超过2MB!')
    return false
  }
  const reader = new FileReader()
  reader.readAsDataURL(rawFile)
  reader.onload = () => {
    imgBlob.value = reader.result
  }
}

const changeScale = (num) => {
  num = num || 1;
  proxy.$refs.cropper.changeScale(num);
};

const rotateLeft = () => {
  proxy.$refs.cropper.rotateLeft()
}

const rotateRight = () => {
  proxy.$refs.cropper.rotateRight()
}

const handleRealPreview = (data) => {
  console.log('实时预览', data);
};

const openDialog = (data) => {
  showDialog.value = true;
};

const handleUpload = () => {
  showDialog.value = false;
  emit('confirm', showDialog.value);
};

defineExpose({
  openDialog
});
</script>
<style lang="scss" scoped>
.cropper-shade {
  border-radius: 50%;
}
.select-handle-move {
  background-color: transparent;
}
</style>