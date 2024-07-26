<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="类型名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="所属区域" prop="areaCode">
        <PoiAreaSelect v-model="formData.areaCode"></PoiAreaSelect>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <UploadImage v-model:img-url="formData.icon"></UploadImage>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="formData.sort" placeholder="不填写默认1" show-word-limit maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')" />
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
import { createApi, updateApi } from '@/api/poi/type';
import { successMsg } from '@/utils/message.js';
import UploadImage from '@/components/UploadImage.vue';
import PoiAreaSelect from '@/components/PoiAreaSelect.vue';

const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);
const loading = ref(false);
const disabled = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }],
  areaCode: [{ required: true, message: '请选择所属区域', trigger: 'change' }],
  icon: [{ required: true, message: '图标不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: null,
  areaCode: null,
  icon: null,
  sort: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑点位类型';
    formData.value = { ...row };
  } else {
    dialogTitle.value = '新增点位类型';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: null,
    areaCode: null,
    icon: null,
    sort: null
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
            successMsg('点位信息更新成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('点位信息添加成功');
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
