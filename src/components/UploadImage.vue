<template>
  <div>
    <el-upload
      class="image-uploader"
      :action="uploadUrl"
      :headers="headers"
      v-model:file-list="showFile"
      list-type="picture-card"
      :on-success="handleImageSuccess"
      :before-upload="beforeImageUpload"
      :disabled="disabled"
      :on-preview="imagePreview"
      :multiple="true"
      :limit="1"
      :class="{ 'upload-image-hide-box': showFile.length >= 1 || disabled }"
      :on-remove="handleRemoveImage"
    >
      <el-icon class="image-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
    <el-image-viewer v-if="showViewer" z-index="9999" teleported @close="closeViewer" hide-on-click-modal :url-list="previewList"></el-image-viewer>
  </div>
</template>

<script setup>
import useUserStore from '@/store/user.js';
import { errorMsg } from '@/utils/message.js';
import { imageCheck } from '@/utils/image.js';
import { useRoute } from 'vue-router';
import { Plus } from '@element-plus/icons-vue'

const route = useRoute();
// 上传后显示的文件列表
const showFile = ref([]);
const showViewer = ref(false);
// 点击预览显示的文件列表
const previewList = ref([]);
// 父组件传入的文件列表
const imgUrl = defineModel('imgUrl', {
  type: String,
  default: () => ''
});

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});
const userStore = useUserStore();
const uploadUrl = import.meta.env.VITE_API_PREFIX + '/manage/file/upload';
const headers = {
  token: userStore.user?.token
};

const handleImageSuccess = (res, file) => {
  if (res.code !== 200) {
    errorMsg(res.msg);
    if (res.code === 8848) {
      userStore.logout(route.fullPath);
    }
    return;
  }
  const { data } = res;
  file.url = data.address + data.path;
  imgUrl.value = file.url;
};

const closeViewer = () => {
  showViewer.value = false;
};

const beforeImageUpload = (rawFile) => {
  return imageCheck(rawFile);
};

const imagePreview = (uploadFile) => {
  previewList.value = [uploadFile.url];
  showViewer.value = true;
};

const handleRemoveImage = () => {
  showFile.value = [];
  imgUrl.value = '';
};

onMounted(() => {
  if (imgUrl.value) {
    showFile.value = [{ url: imgUrl.value }];
  }
});

watch(imgUrl, (newVal) => {
  if (newVal) {
    showFile.value = [{ url: newVal}]
  } else {
    showFile.value = [];
  }
});
</script>
<style lang="scss" scoped>
.hide_box {
  .el-upload--picture-card {
    display: none !important;
  }
}
</style>
