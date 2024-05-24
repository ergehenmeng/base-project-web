<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="500px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
      v-loading="loading">
      <el-form-item label="图片名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="图片分类" prop="imageType">
        <el-select v-model="formData.imageType" clearable>
          <el-option v-for="item in dictList" :key="item.id" :label="item.showValue" :value="item.hiddenValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传图片" prop="path">
        <el-upload class="image-uploader" :action="uploadUrl", :headers="heanders"
          :show-file-list="false" :on-success="handleImageSuccess" :before-upload="beforeImageUpload">
          <img v-if="formData.path" :src="formData.path" class="image-uploader-preview" />
          <el-icon v-else class="image-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" v-model="formData.remark" autosize
          maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click=" showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { createApi, updateApi } from '@/api/system/role';
import { reactive, ref } from 'vue';
import useDictStore from "@/store/dict.js";
import useUserStore from '@/store/user';

const userStore = useUserStore();
const uploadUrl = import.meta.env.VITE_API_URL + "manage/upload";
const heanders = {
  'token': userStore.user.token
}

const dictStore = useDictStore();
const dictList = dictStore.getDict('image_type');
const loading = ref(false);
const dialogTitle = ref("");
const formDataRef = ref();
const showDialog = ref(false);

const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [
    { required: true, message: '图片名称不能为空', trigger: 'blur' }
  ],
  imageType: [
    { required: true, message: '图片类型不能为空', trigger: 'change' }
  ],
  path: [
    { required: true, message: '请上传图片', trigger: 'blur' }
  ]
})

const formData = ref({
  id: null,
  title: "",
  imageType: null,
  size: 0,
  path: "",
  remark: ""
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = "编辑图片";
    formData.value = Object.assign({}, row);
  } else {
    dialogTitle.value = "新增图片";
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    roleName: "",
    remark: ""
  }
  formDataRef.value?.resetFields();
}

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value).then(res => {
          ElMessage.success("修改角色成功");
          showDialog.value = false;
          emit('reload');
        }).finally(() => {
          loading.value = false;
        })
      } else {
        createApi(formData.value).then(res => {
          ElMessage.success("新增角色成功");
          showDialog.value = false;
          emit('reload');
        }).finally(() => {
          loading.value = false;
        })
      }
    }
  })
}

const handleImageSuccess = (res, file) => {
  formData.value.path = res.data;
  formData.value.size = file.size;
}

const beforeImageUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

defineExpose({
  openDialog
})

</script>

<style lang="scss" scoped></style>
