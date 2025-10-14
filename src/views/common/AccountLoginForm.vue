<template>
  <el-form class="login-form" :rules="formRules" ref="formDataRef" :model="formData" v-if="tabIndex === 0">
    <el-form-item prop="userName">
      <el-input placeholder="账户名/手机号" maxlength="15" v-model="formData.userName" size="large">
        <template #prefix>
          <el-icon :size="20">
            <User />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="pwd">
      <el-input placeholder="请输入密码" v-model="formData.pwd" maxlength="20" size="large" type="password" show-password autocomplete="off">
        <template #prefix>
          <el-icon :size="20">
            <Lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="verifyCode">
      <el-input placeholder="验证码" v-model="formData.verifyCode" maxlength="4" size="large" @keyup.enter="handleLogin" style="width: 60%">
        <template #prefix>
          <el-icon :size="20">
            <CircleCheck />
          </el-icon>
        </template>
      </el-input>
      <div class="login-form-verify">
        <img :src="verifyUrl" @click="getCode" alt="点击刷新" @error="errorHandle" />
      </div>
    </el-form-item>
    <el-form-item>
      <el-button style="width: 100%" size="large" type="primary" @click="handleLogin" :loading="loading">
        <span v-if="!loading">登录</span>
        <span v-else>登录中</span>
      </el-button>
    </el-form-item>
  </el-form>
  <TotpPrompt ref="totpRef" @reload="loginSuccessHandle" @close="loginFail" />
  <TotpScanForm ref="totpScanRef" @reload="loginSuccessHandle" @close="loginFail" />
</template>
<script setup>
import useUserStore from '@/store/user';
import { rsaEncode } from '@/utils/common.js';
import { CircleCheck, Lock, User } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import defaultPng from '@/assets/images/refresh.svg';
import { loginApi } from '@/api/login';
import TotpPrompt from '@/views/common/TotpPrompt.vue';
import TotpScanForm from '@/views/common/TotpScanForm.vue';

const defaultImg = ref(defaultPng);
const userStore = useUserStore();
const router = useRouter();
const totpRef = ref();
const totpScanRef = ref();
const formData = ref({
  userName: null,
  pwd: null,
  verifyCode: null
});
const tabIndex = ref(0);
const formDataRef = ref();
const loading = ref(false);
const api = import.meta.env.VITE_API_PREFIX;
const verifyUrl = ref('');
const getCode = () => {
  verifyUrl.value = api + '/manage/captcha?t=' + new Date().getTime();
};

const errorHandle = () => {
  verifyUrl.value = defaultImg.value;
};

const formRules = reactive({
  userName: [
    { required: true, message: '账号不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '账号长度6~15字符', trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      min: 8,
      max: 20,
      message: '密码长度8~20字符',
      trigger: 'blur'
    }
  ],
  verifyCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
});

// 登录
const handleLogin = async () => {
  if (loading.value) {
    return;
  }
  await formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      loginApi({
        userName: formData.value.userName,
        pwd: rsaEncode(formData.value.pwd),
        verifyCode: formData.value.verifyCode
      })
        .then(({ data: { data, state, uuid, qrcode, secretKey } }) => {
          if (state === 1) {
            loginSuccessHandle(data);
          } else if (state === 2) {
            totpRef.value.openDialog({ uuid });
          } else {
            totpScanRef.value.openDialog({ qrcode, secretKey, uuid });
          }
        })
        .catch(() => {
          loginFail();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

const loginFail = () => {
  formData.value.pwd = null;
  formData.value.verifyCode = null;
  getCode();
};

const loginSuccessHandle = (data) => {
  userStore.user = { ...data };
  userStore.isLogin = true;
  router.replace('/home');
};

onActivated(() => {
  getCode();
});
</script>

<style lang="scss" scoped>
.login-form {
  width: 280px;
}
.login-form-verify {
  float: right;
  padding-left: 10px;
  img {
    height: 38px;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>