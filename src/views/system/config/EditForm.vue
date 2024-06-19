<template>
  <el-dialog title="编辑" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="left" label-width="auto" v-loading="loading">
      <el-form-item label="参数名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="30" />
      </el-form-item>
      <el-form-item label="标示符" prop="nid">
        <el-input v-model="formData.nid" disabled />
      </el-form-item>
      <el-form-item label="配置信息" prop="content">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="formData.content" autosize maxlength="400" show-word-limit :disabled="formData.locked" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="formData.remark" autosize maxlength="200" show-word-limit />
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
import { updateApi } from '@/api/system/config';
import { successMsg } from '@/utils/message.js';

const loading = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '参数名称不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '配置信息不能为空', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  title: '',
  locked: false,
  nid: '',
  content: '',
  remark: ''
});

const formDataRef = ref();
const showDialog = ref(false);

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value = { ...row };
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    nid: '',
    locked: false,
    content: '',
    remark: ''
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      updateApi(formData.value)
        .then(() => {
          successMsg('参数修改成功');
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
