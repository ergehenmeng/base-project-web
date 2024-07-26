<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <template #header>
      <span>{{ dialogTitle }} <QuestionTip content="注意：图片编辑时不可修改"></QuestionTip></span>
    </template>
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="图片名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="图片分类" prop="imageType">
        <el-select v-model="formData.imageType" clearable>
          <el-option v-for="item in dictList" :key="item.id" :label="item.showValue" :value="item.hiddenValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="上传图片" prop="path">
        <UploadImage v-model:img-url="formData.path" v-model:size="formData.size" :disabled="formData.id !== null && formData.path !== ''"></UploadImage>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" v-model="formData.remark" autosize maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { createApi, updateApi } from '@/api/system/image';
import useDictStore from '@/store/dict.js';
import { successMsg } from '@/utils/message';
import UploadImage from '@/components/UploadImage.vue';
import QuestionTip from '@/components/QuestionTip.vue'

const dictStore = useDictStore();
const dictList = dictStore.getDict('image_type');
const loading = ref(false);
const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);

const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '图片名称不能为空', trigger: 'blur' }],
  imageType: [{ required: true, message: '图片类型不能为空', trigger: 'change' }],
  path: [{ required: true, message: '请上传图片', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  title: '',
  imageType: null,
  size: "0",
  path: '',
  remark: ''
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑图片';
    formData.value = { ...row };
  } else {
    dialogTitle.value = '新增图片';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    imageType: null,
    size: 0,
    path: '',
    remark: ''
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('修改图片成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增图片成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

defineExpose({
  openDialog
});
</script>
