<template>
  <el-dialog title="动态口令" v-model="showDialog" width="300px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item prop="verifyCode">
        <el-input v-model="formData.verifyCode" maxlength="6" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="checkTotpHandle">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <QRCodeForm ref="qrcodeRef" @reload="handleConfirm" :download="false" button-name="绑定" tips="请下载IOS或Android版Google Authenticator扫码绑定" />
</template>

<script setup>
import { bindTotpApi, checkTotpApi } from '@/api/login/index.js';
import QRCodeForm from '@/views/common/QRCodeForm.vue';
import { errorMsg, successMsg } from '@/utils/message.js'

const loading = ref(false);
const emit = defineEmits(['reload', 'close']);
const formRules = reactive({
  verifyCode: [
    { required: true, message: '动态口令为6位数', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入动态口令'));
        } else if (value.length !== 6) {
          callback(new Error('动态口令为6位数'));
        } else {
          callback();
        }
      }
    }
  ]
});
const qrcodeRef = ref();
const formDataRef = ref();
const formData = ref({
  uuid: null,
  verifyCode: null
});

const confirmData = ref({
  uuid: null,
  secretKey: null
});

const showDialog = ref(false);

const openDialog = ({ uuid }) => {
  showDialog.value = true;
  formData.value.uuid = uuid;
  formData.value.verifyCode = null;
  formDataRef.value?.resetFields();
};

const checkTotpHandle = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      checkTotpApi(formData.value, 2045, () => {
        errorMsg('登录信息已过期,请重新登陆')
        emit('close')
        showDialog.value = false
      }).then(({ data }) => {
          emit('reload', data);
      }).catch(() => {})
        .finally(() => {
          loading.value = false;
      });
    }
  });
};

const handleConfirm = () => {
  bindTotpApi(confirmData.value).then(() => {
    successMsg('双因子绑定成功');
  });
};

defineExpose({
  openDialog
});
</script>
