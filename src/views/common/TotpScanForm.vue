<template>
  <el-dialog title="绑定" v-model="showDialog" width="420px" draggable align-center :close-on-click-modal="false">
    <el-form ref="formDataRef" :model="formData" :rules="formRules" label-width="80px">
      <el-form-item label="二维码">
        <el-image fit="cover" :src="qrCode" style="width: 80%"></el-image>
      </el-form-item>
      <el-form-item label="动态口令" prop="verifyCode">
        <el-input v-model="formData.verifyCode" maxlength="6" onkeyup="this.value=this.value.replace(/\D/g,'')" class="w280"></el-input>
      </el-form-item>
      <div class="tips-container">
        <h5>说明</h5>
        <p class="tips">1、在Google Play或App Store上搜索Google Authenticator并下载</p>
        <p class="tips">2、国内请在手机应用商店用Authenticator、TOTP关键字搜索并下载</p>
        <p class="tips">3、APP扫描二维码后会生成动态口令，输入动态口令即可完成绑定</p>
        <p class="tips">4、该二维码请勿泄露给其他任何人</p>
      </div>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false" >取消</el-button>
        <el-button type="primary" @click="confirmHandle">绑定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { bindTotpApi } from '@/api/login';
import {errorMsg, successMsg} from '@/utils/message.js';
const loading = ref(false);
const showDialog = ref(false);
const emit = defineEmits(['reload', 'close']);
const formDataRef = ref();
const qrCode = ref('');
const formData = ref({
  uuid: null,
  secretKey: null,
  verifyCode: null
});

const formRules = reactive({
  verifyCode: [{ required: true, message: '动态口令为6位数', trigger: 'blur' }, {
    validator: (_rule, value, callback) => {
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

/**
 * 打开弹窗并显示二维码
 * @param qrcode 二维码base64图片
 * @param secretKey 密钥
 * @param uuid
 */
const openDialog = ({ qrcode, secretKey, uuid}) => {
  showDialog.value = true;
  qrCode.value = qrcode;
  formData.value.secretKey = secretKey;
  formData.value.uuid = uuid;
  formDataRef.value?.resetFields();
};

const confirmHandle = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      bindTotpApi(formData.value, 2045, () => {
        errorMsg('登录信息已过期,请重新登陆')
        emit('close')
        showDialog.value = false
      }).then(( { data }) => {
        successMsg('绑定成功', () => {
          showDialog.value = false;
          emit('reload', data);
        })
      }).finally(() => {
        loading.value = false;
      });
    }
  });
};

defineExpose({
  openDialog
});
</script>
<style scoped lang="scss">
.tips-container {
  padding-left: 10px;
}
.tips {
  font-size: 12px;
  margin-top: 2px;
}
</style>
