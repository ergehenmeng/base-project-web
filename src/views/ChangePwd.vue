<template>
  <el-dialog
    title="修改密码"
    v-model="showDialog"
    width="550px"
    draggable
    align-center
    :close-on-click-modal="false"
  >
    <el-form
      :model="formData"
      ref="formDataRef"
      :rules="formRules"
      label-position="right"
      label-width="auto"
      v-loading="loading"
    >
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input v-model="formData.oldPwd" type="password" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="密码" prop="newPwd">
        <el-input
          v-model="formData.newPwd"
          type="password"
          placeholder="密码必须包含英文字符、数字、@#&_"
          show-word-limit
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input v-model="formData.confirmPwd" type="password" show-word-limit maxlength="20" />
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
import { changePwdApi } from '@/api/system/user';
import { reactive, ref } from 'vue';
import { successMsg } from '@/utils/message.js';

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);

const formRules = reactive({
  oldPwd: [
    { required: true, message: '原密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newPwd: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#&_]).{8,16}$/,
      message: '密码必须包含英文字符、数字、@#&_',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.value.confirmPwd) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPwd: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#&_]).{8,16}$/,
      message: '密码必须包含英文字符、数字、@#&_',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formData.value.newPwd) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

const formData = ref({
  oldPwd: null,
  newPwd: null,
  confirmPwd: null
});

const openDialog = () => {
  showDialog.value = true;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    oldPwd: null,
    newPwd: null,
    confirmPwd: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      changePwdApi(formData.value)
        .then(() => {
          successMsg('修改密码成功');
          showDialog.value = false;
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
