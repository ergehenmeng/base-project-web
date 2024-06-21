<template>
  <el-dialog title="解绑手机号" v-model="showDialog" width="350px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="验证码" prop="smsCode">
        <el-input v-model="formData.smsCode" maxlength="6">
          <template #append>
            <el-button type="info" @click="handleSendSms" style="width: 120px" :disabled="disabled">{{ buttonName }} </el-button>
          </template>
        </el-input>
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
import { sendSmsApi, unbindApi } from '@/api/merchant/detail';
import { reactive, ref } from 'vue';
import { successMsg } from '@/utils/message.js';

const loading = ref(false);
const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);
const disabled = ref(false);
const emit = defineEmits(['reload']);
const buttonName = ref('发送验证码');

const formRules = reactive({
  smsCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
});

const formData = ref({
  smsCode: null
});

const openDialog = () => {
  showDialog.value = true;
  resetForm();
};

const resetForm = () => {
  formData.value = {
    smsCode: null
  };
  formDataRef.value?.resetFields();
};

const handleSendSms = () => {
  sendSmsApi().then(() => {
    let time = 60;
    let timer = setInterval(() => {
      disabled.value = true;
      time--;
      buttonName.value = '重新发送(' + time + 'S)';
      if (time === 0) {
        clearInterval(timer);
        buttonName.value = '发送验证码';
        disabled.value = false;
      }
    }, 1000);
  });
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      unbindApi(formData.value)
        .then(() => {
          successMsg('解绑手机号成功');
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
