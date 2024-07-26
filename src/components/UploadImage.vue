<template>
  <el-upload
    class="image-uploader"
    :action="uploadUrl"
    :headers="headers"
    :show-file-list="false"
    :on-success="handleImageSuccess"
    :before-upload="beforeImageUpload"
    :disabled="prop.disabled"
    accept="image/*"
    :title="prop.tips"
  >
    <img v-if="imgUrl" :src="imgUrl" class="image-uploader-preview" alt="预览" />
    <el-icon v-else class="image-uploader-icon">
      <Plus />
    </el-icon>
  </el-upload>
</template>

<script setup>
import useUserStore from '@/store/user.js';
import { errorMsg } from '@/utils/message.js';
import { imageCheck } from '@/utils/image.js';
import { useRoute } from 'vue-router';
import { Plus } from '@element-plus/icons-vue'

const route = useRoute();
const imgUrl = defineModel("imgUrl");
const size = defineModel("size");
const prop = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  tips: {
    type: String,
    default: '点击上传图片'
  }
});
const userStore = useUserStore();
const uploadUrl = import.meta.env.VITE_API_URL + '/manage/file/upload';
const headers = {
  token: userStore.user?.token
};

const handleImageSuccess = (res) => {
  if (res.code !== 200) {
    errorMsg(res.msg);
    if (res.code === 8848) {
      userStore.logout(route.fullPath);
    }
    return;
  }
  const { data } = res;
  imgUrl.value = data.address + data.path;
  size.value = data.size;
};

const beforeImageUpload = (rawFile) => {
  return imageCheck(rawFile);
};
</script>
