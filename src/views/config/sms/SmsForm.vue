<template>
  <el-dialog title="编辑模板" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="模板编号" prop="nid">
        <el-input v-model="formData.nid" show-word-limit maxlength="20" disabled />
      </el-form-item>
      <el-form-item label="模板内容" prop="content">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="formData.content" maxlength="70" show-word-limit />
      </el-form-item>
      <el-form-item label="备注信息" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="formData.remark" maxlength="200" show-word-limit />
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
import { updateApi } from '@/api/config/sms';
import { successMsg } from '@/utils/message';

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  content: [{ required: true, message: '模板内容不能为空', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  content: '',
  remark: ''
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value = { ...row };
};

const resetForm = () => {
  formData.value = {
    id: null,
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
          successMsg('短信模板更新成功');
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
