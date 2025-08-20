<template>
  <el-form class="login-form" :rules="formRules" ref="formDataRef" :model="formData" >
    <el-form-item prop="mobile">
      <el-input placeholder="请输入手机号" maxlength="11" v-model="formData.mobile" size="large">
        <template #prefix>
          <el-icon :size="20">
            <Iphone />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="verifyCode">
      <el-input placeholder="图形验证码" v-model="formData.verifyCode" maxlength="4" size="large" style="width: 60%" @keyup.enter="sendSmsHandle">
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
    <el-form-item prop="smsCode">
      <el-input placeholder="请输入验证码" v-model="formData.smsCode" maxlength="6" size="large" autocomplete="off" @keyup.enter="handleLogin">
        <template #prefix>
          <el-icon :size="20">
            <Shield />
          </el-icon>
        </template>
        <template #suffix>
          <span :class="{ 'send-btn': sendCode, 'send-btn-disabled': !sendCode }" @click="sendSmsHandle" >{{buttonName}}</span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button style="width: 100%" size="large" type="primary" @click="handleLogin" :loading="loading" >
        <span v-if="!loading">登录</span>
        <span v-else>登录中</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { CircleCheck, Iphone } from '@element-plus/icons-vue';
import useUserStore from '@/store/user.js';
import { useRoute, useRouter } from 'vue-router';
import { sendSmsApi, smsLoginApi } from '@/api/login/index.js';
import defaultPng from '@/assets/images/refresh.svg';
import Shield from '@/components/Shield.vue';
import { startCountDown } from '@/utils/common.js'
import { successMsg } from '@/utils/message.js'
const userStore = useUserStore();
const defaultImg = ref(defaultPng);
const router = useRouter();
const route = useRoute();
const sendCode = ref(true);
const formDataRef = ref();
const loading = ref(false);
const formData = ref({
  mobile: null,
  verifyCode: null,
  smsCode: null
});
const buttonName = ref('获取验证码');
const formRules = reactive({
  mobile: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  verifyCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
});

const api = import.meta.env.VITE_API_PREFIX;
const verifyUrl = ref('');
const getCode = () => {
  verifyUrl.value = api + '/manage/captcha?t=' + new Date().getTime();
};

const errorHandle = () => {
  verifyUrl.value = defaultImg.value;
};

const loginFail = () => {
  formData.value.smsCode = null;
  formData.value.verifyCode = null
  getCode()
}

const sendSmsHandle = () => {
  if (!sendCode.value) {
    return;
  }
  formRules.smsCode = [];
  formDataRef.value.validate((valid) => {
    if (valid) {
      sendCode.value = false;
      sendSmsApi({ mobile: formData.value.mobile, verifyCode: formData.value.verifyCode }).then(() => {
        countDown()
        successMsg('验证码发送成功')
      }).catch(() => {
        sendCode.value = true;
        loginFail()
      });
    }
  });
};

const handleLogin = async () => {
  if (loading.value) {
    return;
  }
  formRules.smsCode = [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
  await formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      smsLoginApi(formData.value)
        .then(({ data }) => {
          loginSuccessHandle(data);
        })
        .catch(() => {
          loginFail()
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

const countDown = () => {
  startCountDown(60, (time) => {
    if (time > 0) {
      buttonName.value = `${time}s后重新发送`;
    } else {
      buttonName.value = '发送验证码';
      sendCode.value = true;
    }
  })
};

const loginSuccessHandle = (data) => {
  userStore.user = { ...data };
  userStore.isLogin = true;
  const fullPath = route.fullPath;
  if (fullPath.startsWith('/login?redirect=')) {
    const path = getPath(fullPath.replace('/login?redirect=', ''));
    router.replace(path);
  } else {
    router.replace('/');
  }
};

onActivated(() => {
  getCode();
});
/**
 * 因为浏览器原因或权限变更的原因, 可能会出现redirect的路径不在用户权限列表中, 则跳转到首页
 * @param path
 * @returns {string}
 */
const getPath = (path) => {
  const menuList = userStore.user?.menuList;
  for (let menu of menuList) {
    if (menu.children) {
      for (let item of menu.children) {
        if (item.path === path) {
          return path;
        }
      }
    }
  }
  return '/';
};
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
.send-btn:hover {
  cursor: pointer;
}
.send-btn {
  color: #409eff;
  font-size: 14px;
  line-height: 14px;
}
.send-btn-disabled {
  color: #c0c4cc;
}
.send-btn-disabled:hover {
  cursor: pointer;
}
</style>