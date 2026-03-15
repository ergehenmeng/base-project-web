<template>
  <el-dialog v-model="showDialog" width="350px" draggable align-center>
    <template #header>
      <span>修改用户信息<QuestionTip content="注意：账户名需要联系管理员" /></span>
    </template>
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="账户名" prop="userName" class="w300">
        <el-input v-model="formData.userName" readonly />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName" class="w300">
        <el-input v-model="formData.nickName" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile" class="w300">
        <el-input v-model="formData.mobile" maxlength="11" />
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
import { updateUserApi } from '@/api/system/user';
import { successMsg } from '@/utils/message.js';
import useUserStore from '@/store/user.js';
import QuestionTip from '@/components/QuestionTip.vue';
const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const userStore = useUserStore();
const formRules = reactive({
  nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  mobile: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
});

const formData = ref({
  userName: '',
  nickName: '',
  mobile: null
});

const openDialog = () => {
  showDialog.value = true;
  formDataRef.value?.resetFields();
  formData.value.userName = userStore.user?.userName;
  formData.value.nickName = userStore.user?.nickName;
  formData.value.mobile = userStore.user?.mobile;
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      updateUserApi({ nickName: formData.value.nickName, mobile: formData.value.mobile })
        .then(() => {
          successMsg('用户信息修改成功');
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
