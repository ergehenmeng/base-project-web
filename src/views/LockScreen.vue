<template>
  <el-dialog title="锁屏中" v-model="showDialog" width="400px" align-center :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="密码" prop="pwd" class="w350">
        <el-input v-model="formData.pwd" type="password" show-word-limit maxlength="20" style="width: 280px !important;"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="handleLogout">退出系统</el-button>
        <el-button type="primary" @click="handleSave">解锁</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { unlockScreenApi, lockScreenApi } from '@/api/system/user';
import { confirmMsg, successMsg } from '@/utils/message.js'
import useUserStore from '@/store/user.js'
import md5 from 'md5';
import { renderMsg } from '@/utils/common.js'

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const userStore = useUserStore();

const formRules = reactive({
  pwd: [
    { required: true, message: '密码不能为空', trigger: 'blur' }
  ]
});

const formData = ref({
  pwd: null,
});

const openDialog = () => {
  if (!showDialog.value) {
    lockScreenApi({}).then(() => {
      userStore.setLock(true);
      showDialog.value = true;
      resetForm();
    })
  }
};

const handleLogout = () => {
  const msg = renderMsg(["确定要", () => "退出", "系统吗?"]);
  confirmMsg(msg, () => {
    showDialog.value = false;
    userStore.logout();
  });
};

const resetForm = () => {
  formData.value = {
    pwd: null,
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      unlockScreenApi({pwd: md5(formData.value.pwd)})
        .then(() => {
          userStore.setLock(false);
          successMsg('解锁成功');
          showDialog.value = false;
        })
        .finally(() => {
          resetForm();
          loading.value = false;
        });
    }
  });
};

defineExpose({
  openDialog
});
</script>
