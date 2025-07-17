<template>
  <el-dialog title="动态口令" v-model="showDialog" width="300px" draggable align-center :close-on-click-modal="false">
    <el-input v-model="formData.verifyCode" placeholder="无动态口令直级点击确认" maxlength="6" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
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
const qrcodeRef = ref();
const formData = ref({
  uuid: null,
  verifyCode: null,
});

const confirmData = ref({
  uuid: null,
  secretKey: null
});

const showDialog = ref(false);

const openDialog = (uid) => {
  showDialog.value = true;
  formData.value.uuid = uid;
  formData.value.verifyCode = null;
};

const checkTotpHandle = () => {
  checkTotpApi(formData.value).then(({data: { data, state, uuid, secretKey, qrcode}}) => {
    if (state === 1) {
      emit('reload', data);
    } else {
      confirmData.value.uuid = uuid;
      confirmData.value.secretKey = secretKey;
      qrcodeRef.value.openDialog({ base64: qrcode, remark: '扫码完成后请按【绑定】按钮进行绑定'});
    }
  })
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
