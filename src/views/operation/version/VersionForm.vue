<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="left" label-width="auto" v-loading="loading">
      <el-form-item label="客户端" prop="channel">
        <el-select v-model="formData.channel" @change="handleChange" :disabled="formData.id !== null">
          <el-option label="IOS" value="IOS" />
          <el-option label="ANDROID" value="ANDROID" />
        </el-select>
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input v-model="formData.version" placeholder="例如:1.2.8, 最大支持xx.xx.xx" :disabled="formData.id !== null" />
      </el-form-item>
      <el-form-item label="是否强更" prop="forceUpdate">
        <el-radio-group v-model="formData.forceUpdate">
          <el-radio :value="true">是</el-radio>
          <el-radio :value="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="下载链接" prop="url">
        <el-input v-model="formData.url" :disabled="formData.id !== null" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="formData.remark" autosize maxlength="400" show-word-limit />
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
import { reactive, ref } from 'vue';
import { createApi, updateApi } from '@/api/operation/version';
import { successMsg } from '@/utils/message.js';

const iosDownload = import.meta.env.VITE_IOS_DOWNLOAD_URL;
const loading = ref(false);
const emit = defineEmits(['reload']);
const dialogTitle = ref('');

const formRules = reactive({
  title: [{ required: true, message: '参数名称不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '配置信息不能为空', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  channel: 'ANDROID',
  forceUpdate: false,
  content: '',
  remark: ''
});

const formDataRef = ref();
const showDialog = ref(false);

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑版本';
    formData.value = { ...row };
  } else {
    dialogTitle.value = '新增版本';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    channel: 'ANDROID',
    forceUpdate: false,
    content: '',
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
            successMsg('修改版本成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增版本成功');
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

const handleChange = (value) => {
  if (value === 'IOS') {
    formData.value.url = iosDownload;
  }
};

defineExpose({
  openDialog
});
</script>
