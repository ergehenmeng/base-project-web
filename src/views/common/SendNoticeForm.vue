<template>
  <el-dialog title="发送站内信" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="left" label-width="auto" v-loading="loading">
      <el-form-item label="消息名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="通知类型" prop="noticeType">
        <el-select v-model="formData.noticeType">
          <el-option label="通用类通知" value="common" />
          <el-option label="营销通知" value="marketing" />
          <el-option label="反馈处理" value="feedback_process" />
          <el-option label="订单评价内容不合规" value="evaluation_refuse" />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 7 }" v-model="formData.content" autosize maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">发送站内信</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { sendSmsApi } from '@/api/user/member';
import { errorMsg, successMsg } from '@/utils/message.js';

const loading = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '消息名称不能为空', trigger: 'blur' }],
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
  title: null,
  noticeType: 'common',
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
    title: null,
    noticeType: 'common',
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
          successMsg('站内信发送成功');
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
