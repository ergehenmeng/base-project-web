<template>
  <el-dialog :title="title" v-model="showDialog" width="600px" draggable align-center :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row>
      <el-col :span="12" style="height: 200px">
        <vue-cropper
          ref="cropperRef"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :fixedBox="options.fixedBox"
          :outputType="options.outputType"
          :can-move="options.canMove"
          :fixed="options.fixed"
          @realTime="handleRealPreview"
          v-if="openDialog"
        />
      </el-col>
      <el-col :span="12"></el-col>
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
import { VueCropper } from 'vue-cropper';
import 'vue-cropper/dist/index.css'
import { getCurrentInstance, reactive } from 'vue';
import { Minus, Plus, RefreshLeft, RefreshRight } from '@element-plus/icons-vue';
import { errorMsg } from '@/utils/message.js';

const { proxy } = getCurrentInstance();
const cropperRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['confirm']);
const props = defineProps({
  title: {
    type: String,
    default: '头像上传'
  }
});
/**
 *  配置信息参考如下: https://github.xyxiao.cn/vue-cropper/
 */
const options = reactive({
  img: null,
  outputType: 'png',
  autoCrop: true,
  fixedBox: false,
  canMove: false,
  fixed: true
});

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
    // 图片在这里
    options.img = reader.result
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
.avatar-container {
  .img-box {
    border-radius: 50%;
    border: 1px solid #ccc;
    width: 10vw;
    height: 10vw;
  }
}
.preview-box {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px solid #ccc;
  overflow: hidden;
}
</style>