<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="520px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="标签名称" prop="title" class="w450">
        <el-input v-model="formData.title" show-word-limit maxlength="8" />
      </el-form-item>
      <el-form-item label="图标" prop="icon" >
        <UploadImage v-model:img-url="formData.icon"></UploadImage>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio :value="true">启用</el-radio>
          <el-radio :value="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark" class="w450">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="formData.remark" maxlength="100" show-word-limit />
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
import { createApi, updateApi } from '@/api/config/itemTag';
import { successMsg } from '@/utils/message.js';
import UploadImage from '@/components/UploadImage.vue';

const loading = ref(false);
const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '标签名称不能为空', trigger: 'blur' }],
  icon: [{ required: true, message: '请上传图标', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: '',
  icon: '',
  pid: '',
  state: true,
  remark: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑标签';
    formData.value = { ...row };
  } else {
    formData.value.pid = row.pid;
    dialogTitle.value = '新增标签';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    icon: '',
    pid: '',
    state: true,
    remark: null
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
            successMsg('修改标签成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增标签成功');
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
