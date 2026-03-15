<template>
  <el-dialog v-model="showDialog" width="600px" draggable align-center :close-on-press-escape="false" >
    <template #header>
      <span>{{props.title}}</span>
    </template>
    <div v-loading="loading">
      <el-row>
        <el-col :span="12">
          <div class="cropper-upload-box">
              <cropper-canvas background key="image" v-if="updateUrl">
              <cropper-image ref="cropperImgRef" :src="updateUrl" rotatable scalable skewable translatable></cropper-image>
              <cropper-shade class="cropper-shade"></cropper-shade>
              <cropper-selection ref="selectRef" movable resizable outlined :aspectRatio="1" id="cropperSelected" initial-coverage="0.6">
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
            <cropper-viewer selection="#cropperSelected" v-if="updateUrl"></cropper-viewer>
            <div class="cropper-viewer" v-else>
              <el-image :src="previewUrl" v-show="previewUrl !== null && previewUrl !== undefined"></el-image>
            </div>
            <canvas ref="canvasRef" style="display: none"></canvas>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px">
        <el-col :span="2">
          <el-upload action="#" :http-request="() => {}" :before-upload="beforeUpload" :show-file-list="false" accept=".jpg,.jpeg,.png">
            <el-button plain type="primary" :icon="UploadFilled" title="请选择要上传的图片"></el-button>
          </el-upload>
        </el-col>
        <el-col :span="2" :offset="7">
          <el-button :icon="RefreshLeft" circle @click="rotateLeft()" title="向左旋转90度"></el-button>
        </el-col>
        <el-col :span="2">
          <el-button :icon="RefreshRight" circle @click="rotateRight()" title="向右旋转90度"></el-button>
        </el-col>
        <el-col :span="2" :offset="8">
          <el-button type="primary" @click="handleUpload">上传</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script setup>
import 'cropperjs';
import { CropperCanvas, CropperCrosshair, CropperHandle, CropperImage, CropperSelection, CropperShade, CropperViewer } from 'cropperjs';
import { RefreshLeft, RefreshRight, UploadFilled } from '@element-plus/icons-vue';
import { errorMsg } from '@/utils/message.js';
import { updateAvatarApi } from '@/api/system/user';

const loading = ref(false);
const selectRef = ref();
const canvasRef = ref();
const cropperImgRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['confirm']);
const updateUrl = ref();
const previewUrl = ref();

const props = defineProps({
  title: {
    type: String,
    default: '头像上传',
  }
})

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
    updateUrl.value = reader.result;
  };
};

const rotateLeft = () => {
  cropperImgRef.value.$rotate('-90deg');
};

const rotateRight = () => {
  cropperImgRef.value.$rotate('90deg');
};

const openDialog = (url) => {
  updateUrl.value = null
  showDialog.value = true;
  previewUrl.value = url;
};

const handleUpload = async () => {
  if (!updateUrl.value) {
    return;
  }
  const canvas = await selectRef.value.$toCanvas();
  const circleCanvas = canvasRef.value;
  const context = circleCanvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  const size = Math.min(canvas.width, canvas.height);
  circleCanvas.width = size;
  circleCanvas.height = size;
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  context.closePath();
  context.clip();
  context.drawImage(canvas, 0, 0, size, size);
  circleCanvas.toBlob(
    (blob) => {
      loading.value = true;
      const formData = new FormData();
      formData.append('file', blob, 'cropped-image.png');
      updateAvatarApi(formData)
        .then(({ data: { host, path} }) => {
          emit("confirm", host + path);
          showDialog.value = false;
        })
        .finally(() => {
          loading.value = false;
        });
    },
    'image/png',
    0.95
  );
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
  border: 1px dashed #d9d9d9;
  height: 250px;
  width: 250px;

  cropper-canvas {
    width: 100%;
    height: 100%;
  }
}

.cropper-preview-box {
  height: 250px;
  width: 250px;
  padding: 50px;
  .cropper-viewer {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    border: 1px solid #ccc;
  }
  cropper-viewer {
    border-radius: 50%;
  }
}

.select-handle-move {
  background-color: transparent;
}
</style>
