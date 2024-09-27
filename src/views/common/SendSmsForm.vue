<template>
  <el-dialog v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <template #header>
      <span class="dialog-header">发送短信<QuestionTip content="注意：如果是模板短信，请先在短信模板中配置后再发送且不支持含参数的短信"/></span>
    </template>
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="left" label-width="auto" v-loading="loading">
      <el-form-item label="短信内容" prop="content">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="formData.content" maxlength="70" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">发送短信</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { sendSmsApi } from '@/api/user/member';
import { errorMsg, successMsg } from '@/utils/message.js';
import QuestionTip from '@/components/QuestionTip.vue'

const loading = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  content: [
    { required: true, message: '短信内容不能为空', trigger: 'blur' },
    {
      min: 10,
      max: 70,
      message: '短信内容长度10~70字符',
      trigger: 'blur'
    }
  ]
});

const formData = ref({
  content: null,
  memberIds: [],
  tagId: null
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
    content: null,
    memberIds: [],
    tagId: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      if (formData.value.memberIds.length === 0 && !formData.value.tagId) {
        errorMsg('请选择会员或标签');
        return;
      }
      loading.value = true;
      sendSmsApi(formData.value)
        .then(() => {
          successMsg('短信发送成功');
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
