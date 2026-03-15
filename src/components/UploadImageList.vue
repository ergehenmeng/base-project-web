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
      :limit="limit"
      :on-exceed="handleExceed"
      :class="{ 'upload-image-hide-box': showFile.length >= limit || disabled }"
      :on-remove="handleRemoveImage"
    >
      <el-icon class="image-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
    <el-image-viewer v-if="showViewer" @close="closeViewer" hide-on-click-modal :url-list="previewList"></el-image-viewer>
  </div>
</template>

<script setup>
import useUserStore from '@/store/user.js';
import { errorMsg } from '@/utils/message.js';
import { imageCheck } from '@/utils/image.js';
import { Plus } from '@element-plus/icons-vue'

// 上传后显示的文件列表
const showFile = ref([]);
const showViewer = ref(false);
// 点击预览显示的文件列表
const previewList = ref([]);
// 父组件传入的文件列表
const fileList = defineModel('fileList', {
  type: Array,
  default: () => []
});

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 9
  }
});

const disabled = toRef(props, 'disabled');
const limit = toRef(props, 'limit');
const userStore = useUserStore();
const uploadUrl = import.meta.env.VITE_API_PREFIX + '/manage/file/upload';
const headers = {
  token: userStore.user?.token
};

const handleImageSuccess = (res, file) => {
  if (res.code !== 200) {
    errorMsg(res.msg);
    if (res.code === 8848) {
      userStore.logout();
    }
    return;
  }
  const { data } = res;
  file.url = data.host + data.path;
  fileList.value.push(file.url);
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

const handleExceed = () => {
  errorMsg('最多只能上传' + limit.value + '张图片');
};

const handleRemoveImage = (uploadFile, _uploadFiles) => {
  let removeIndex;
  showFile.value.forEach((item, index) => {
    if (item['url'] === uploadFile.url) {
      removeIndex = index;
    }
  });
  fileList.value.splice(removeIndex, 1);
};

const convert = (fileList) => {
  const arr = [];
  if (fileList instanceof Array) {
    fileList.forEach((item) => {
      arr.push({ url: item });
    });
  } else {
    console.log('fileList only supported array');
  }
  return arr;
};

watch(fileList, (newVal, oldVal) => {
  if (Array.isArray(newVal)) {
    showFile.value = convert(newVal);
  } else if (!newVal) {
    fileList.value = [];
    showFile.value = [];
  }
});

onMounted(() => {
  if (Array.isArray(fileList.value)) {
    showFile.value = convert(fileList.value);
  } else if (!fileList.value) {
    fileList.value = [];
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
