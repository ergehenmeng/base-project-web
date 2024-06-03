<template>
  <el-upload class="image-uploader" :action="uploadUrl" :headers="headers" v-model:file-list="localFile"
             list-type="picture-card" :on-success="handleImageSuccess" :before-upload="beforeImageUpload"
             :disabled="prop.disabled" :on-preview="imagePreview" :multiple="true"
             :limit="prop.limit" :on-exceed="handleExceed" :class="fileList.length >= prop.limit ? 'upload-image-hide-box' : ''"
              :on-remove="handleRemoveImage">
    <el-icon v-if="prop.limit " class="image-uploader-icon">
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
const localFile = ref([]);
const fileList = defineModel({
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
  fileList.value.push(file.url);
}

const beforeImageUpload = (rawFile) => {
  return imageCheck(rawFile);
}

const imagePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
}

const handleExceed = () => {
  errorMsg("最多只能上传" + prop.limit + "张图片");
}

const handleRemoveImage = (uploadFile, uploadFiles)=> {
  let removeIndex;
  localFile.value.forEach((item, index) => {
    if (item["url"] === uploadFile.url) {
      removeIndex = index;
    }
  })
  fileList.value.splice(removeIndex, 1)
}

const convert = (fileList) => {
  const arr = [];
  if (fileList instanceof Array) {
    fileList.forEach((item) => {
      arr.push({url: item});
    })
  } else {
    console.log("fileList only supported array")
  }
  return arr;
}

watch(fileList, (newVal, oldVal) => {
  if (Array.isArray(oldVal) && oldVal.length === 0) {
    localFile.value = convert(newVal);
  }
})

onMounted(() => {
  localFile.value = convert(fileList.value);
})

</script>
<style lang="scss" scoped>
.hide_box {
  .el-upload--picture-card {
    display: none !important;
  }
}
</style>