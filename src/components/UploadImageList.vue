<template>
  <el-upload class="image-uploader" :action="uploadUrl" :headers="headers" :file-list="fileList"
             list-type="picture-card" :on-success="handleImageSuccess" :before-upload="beforeImageUpload"
             :disabled="prop.disabled" :on-preview="imagePreview" :multiple="true" :limit="prop.limit">
    <el-icon class="image-uploader-icon">
      <Plus />
    </el-icon>
  </el-upload>
  <el-dialog v-model="dialogVisible" width="550" >
    <img :src="dialogImageUrl" alt="图片预览"  style="width: 515px; height: 350px;"/>
  </el-dialog>
</template>

<script setup>
import useUserStore from "@/store/user.js";
import { errorMsg } from "@/utils/message.js";
import { imageCheck } from "@/utils/image.js";
import { useRoute } from "vue-router";

const dialogVisible = ref(false);
const dialogImageUrl = ref('');
const route = useRoute();
const fileList = defineModel({
  default: () => [],
  type: Array,
  required: true,
});

const prop = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    // 默认最大限制9张
    default: 9,
  },
})
const userStore = useUserStore();
const uploadUrl = import.meta.env.VITE_API_URL + "/manage/file/upload";
const headers = {
  'token': userStore.user.token
}

const handleImageSuccess = (res) => {
  if (res.code !== 200) {
    errorMsg(res.msg);
    if (res.code === 8848) {
      userStore.logout(route.fullPath);
    }
    return;
  }
  const { data } = res;
  fileList.value.push(data.address + data.path);
}

const beforeImageUpload = (rawFile) => {
  return imageCheck(rawFile);
}

const imagePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
}

</script>

