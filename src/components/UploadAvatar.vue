<template>
  <el-dialog title="头像上传" v-model="showDialog" width="600px" draggable align-center :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row>
      <el-col :span="12" >
        <div class="cropper-upload-box">
          <cropper-canvas background ref="cropperRef" key="image">
            <cropper-image ref="cropperImgRef" :src="imgSrcData" rotatable scalable skewable translatable></cropper-image>
            <cropper-shade class="cropper-shade" ></cropper-shade>
            <cropper-selection movable resizable outlined :aspectRatio="1" id="cropperSelected" initial-coverage="0.5" @change="cropperSelectedChangeHandle">
              <cropper-crosshair centered />
              <cropper-handle class="select-handle-move" action="move" />
              <cropper-handle action="n-resize" />
              <cropper-handle action="e-resize" />
              <cropper-handle action="s-resize" />
              <cropper-handle action="w-resize" />
              <cropper-handle action="ne-resize" />
              <cropper-handle action="nw-resize" />
              <cropper-handle action="se-resize" />
              <cropper-handle action="sw-resize" />
            </cropper-selection>
          </cropper-canvas>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="cropper-preview-box">
          <cropper-viewer selection="#cropperSelected" ></cropper-viewer>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 15px">
      <el-col :span="2">
        <el-upload action="#" :http-request="() => {}" :before-upload="beforeUpload" :show-file-list="false">
          <el-button plain type="primary" :icon="UploadFilled"></el-button>
        </el-upload>
      </el-col>
      <el-col :span="2" :offset="7">
        <el-button :icon="RefreshLeft" circle @click="rotateLeft()"></el-button>
      </el-col>
      <el-col :span="2">
        <el-button :icon="RefreshRight" circle @click="rotateRight()"></el-button>
      </el-col>
      <el-col :span="2" :offset="8">
        <el-button type="primary" @click="handleUpload">上传</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script setup>
import "cropperjs";
import { CropperCanvas, CropperImage, CropperShade, CropperHandle, CropperSelection, CropperCrosshair, CropperViewer } from 'cropperjs';
import { getCurrentInstance } from 'vue';
import { RefreshLeft, RefreshRight, UploadFilled } from '@element-plus/icons-vue';
import { errorMsg } from '@/utils/message.js';
const { proxy } = getCurrentInstance();
const cropperRef = ref();
const cropperImgRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['confirm']);
const imgSrcData = ref();

const cropperSelectedChangeHandle = (event) => {
  console.log(cropperRef.value);
  console.log(cropperImgRef.value);
  const cropperImageRect = cropperImgRef.value.getBoundingClientRect();
  const cropperCanvasRect = cropperRef.value.getBoundingClientRect();
  const selection = event.detail;
  const maxSelection = {
    x: cropperImageRect.left - cropperCanvasRect.left,
    y: cropperImageRect.top - cropperCanvasRect.top,
    width: cropperImageRect.width,
    height: cropperImageRect.height
  };

  if (!inSelection(selection, maxSelection)) {
    event.preventDefault();
  }
};

const inSelection = (selection, maxSelection) => {
  return (
    selection.x >= maxSelection.x &&
    selection.y >= maxSelection.y &&
    selection.x + selection.width <= maxSelection.x + maxSelection.width &&
    selection.y + selection.height <= maxSelection.y + maxSelection.height
  );
};

const beforeUpload = (rawFile) => {
  if (rawFile.type.indexOf('image/') === -1) {
    errorMsg('请上传图片类型文件!');
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    errorMsg('文件大小不能超过2MB!');
    return false;
  }
  const reader = new FileReader();
  reader.readAsDataURL(rawFile);
  reader.onload = () => {
    imgSrcData.value = reader.result;
  };
};

const rotateLeft = () => {
  cropperImgRef.value.$rotate('-90deg');
};

const rotateRight = () => {
  cropperImgRef.value.$rotate('90deg');
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
.cropper-upload-box {
  width: 100%;
  height: 100%;
  cropper-canvas {
    width: 100%;
    height: 100%;
  }
}

.cropper-preview-box {
  padding: 30px;
  cropper-viewer {
    border-radius: 50%;
    border: 1px solid #ccc;
  }
}

.select-handle-move {
  background-color: transparent;
}
</style>
