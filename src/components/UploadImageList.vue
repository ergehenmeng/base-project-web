<template>
  <el-upload class="image-uploader" :action="uploadUrl" :headers="headers" v-model:file-list="fileList"
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

const fileList = ref([
  {
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  }
])


// const fileList = defineModel({
//   default: () => [{name:"test.jpg", url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"}],
//   type: Array,
//   required: false,
// });

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
  console.log(fileList.value);
  file.url = data.address + data.path;
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
  fileList.value.forEach((item, index) => {
    if (item === uploadFile.url) {
      removeIndex = index;
    }
  })
  fileList.value.splice(removeIndex, 1)
}

</script>
<style lang="scss" scoped>
.hide_box {
  .el-upload--picture-card {
    display: none !important;
  }
}
</style>