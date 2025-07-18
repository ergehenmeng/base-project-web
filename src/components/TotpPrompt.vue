<template>
  <el-dialog title="动态口令" v-model="showDialog" width="300px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item prop="verifyCode">
        <el-input v-model="formData.verifyCode" maxlength="6" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="checkTotpHandle">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <QRCodeForm ref="qrcodeRef" @reload="handleConfirm" :download="false" button-name="绑定" tips="请下载IOS或Android版Google Authenticator扫码绑定"/>
</template>

<script setup>
import {bindTotpApi, checkTotpApi} from "@/api/login/index.js";
import QRCodeForm from "@/views/common/QRCodeForm.vue";
import {successMsg} from "@/utils/message.js";

const loading = ref(false);
const emit = defineEmits(['reload']);
const formRules = reactive({
  verifyCode: [{ required: true, message: '动态口令为6位数', trigger: 'blur' }, {
    validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入动态口令'));
      } else if (value.length !== 6) {
        callback(new Error('动态口令为6位数'));
      } else {
        callback();
      }
    }
  }]
});
const qrcodeRef = ref();
const formDataRef = ref();
const formData = ref({
  uuid: null,
  verifyCode: null,
});

const confirmData = ref({
  uuid: null,
  secretKey: null
});

const showDialog = ref(false);

const openDialog = ({uuid, showBind, qrcode, secretKey}) => {
  showDialog.value = true;
  formData.value.uuid = uuid;
  formData.value.verifyCode = null;
  if (showBind) {
    confirmData.value.uuid = uuid;
    confirmData.value.secretKey = secretKey;
    qrcodeRef.value.openDialog({ base64: qrcode, remark: '扫码完成后请按【绑定】按钮进行绑定'});
  }
};

const checkTotpHandle = () => {
  checkTotpApi(formData.value).then(({data }) => {
    emit('reload', data);
  }).catch(() => {
    formData.value.verifyCode = null;
  }).finally(() => {
    loading.value = false;
  });

  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;

    }
  });
};

const handleConfirm = () => {
  bindTotpApi(confirmData.value).then(()=> {
    successMsg('双因子绑定成功')
  })
}

defineExpose({
  openDialog
});
</script>
