<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="场地名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="所属场地" prop="venueId">
        <VenueSelect v-model="formData.venueId" :clearable="false"></VenueSelect>
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImageList v-model:file-list="formData.coverUrl" :disabled="disabled" :limit="8"></UploadImageList>
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
import { createApi, updateApi } from '@/api/product/site';
import { successMsg } from '@/utils/message.js';
import UploadImageList from '@/components/UploadImageList.vue';
import VenueSelect from '@/components/VenueSelect.vue';

const dialogTitle = ref('');
const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const disabled = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '场地名称不能为空', trigger: 'blur' }],
  venueId: [{ required: true, message: '请选择场馆', trigger: 'change' }],
  coverUrl: [{ required: true, message: '请上传封面图', trigger: 'change', type: 'array' }]
});

const formData = ref({
  id: null,
  title: null,
  venueId: null,
  coverUrl: []
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('修改场地信息成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增场地信息成功');
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

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑场地';
    formData.value = { ...row };
  } else {
    dialogTitle.value = '新增场地';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: null,
    venueId: null,
    coverUrl: []
  };
  formDataRef.value?.resetFields();
};

defineExpose({
  openDialog
});
</script>
