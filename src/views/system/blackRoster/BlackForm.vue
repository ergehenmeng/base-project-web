<template>
  <el-dialog title="新增黑名单" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="开始IP" prop="startIp">
        <el-input v-model="formData.startIp" show-word-limit maxlength="15" />
      </el-form-item>
      <el-form-item label="截止IP" prop="endIp">
        <el-input v-model="formData.endIp" show-word-limit maxlength="15" />
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
import { createApi } from '@/api/system/black';
import { reactive, ref } from 'vue';
import { successMsg } from '@/utils/message.js';

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);

const emit = defineEmits(['reload']);

const formRules = reactive({
  startIp: [
    { required: true, message: '开始IP不能为空', trigger: 'blur' },
    {
      pattern: /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/,
      message: '请输入正确的IP地址',
      trigger: 'blur'
    }
  ],
  endIp: [
    { required: true, message: '截止IP不能为空', trigger: 'blur' },
    {
      pattern: /^([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/,
      message: '请输入正确的IP地址',
      trigger: 'blur'
    }
  ]
});

const formData = ref({
  id: null,
  startIp: '',
  endIp: '',
  remark: ''
});

const openDialog = () => {
  showDialog.value = true;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    id: null,
    startIp: '',
    endIp: '',
    remark: ''
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      createApi(formData.value)
        .then(() => {
          successMsg('新增ip黑名单成功');
          showDialog.value = false;
          emit('reload');
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

defineExpose({
  openDialog
});
</script>
