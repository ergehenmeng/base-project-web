<template>
  <div class="login-container">
    <div class="login-layout">
      <div class="login-layout-left"></div>
      <div class="login-layout-right">
        <h3>后台管理系统</h3>
        <el-form class="login-form" :rules="formRules" ref="formDataRef" :model="formData">
          <el-form-item prop="userName">
            <el-input placeholder="账户名/手机号" maxlength="15" v-model="formData.userName" size="large" >
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
              <img :src="verifyUrl" @click="getCode" alt="点击刷新" @error="errorHandle"/>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" size="large" type="primary" @click="handleLogin()" :loading="loading">
              <span v-if="!loading">登录</span>
              <span v-else>登录中</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <QRCodeForm ref="qrcodeRef" @reload="handleConfirm" :download="false" button-name="绑定" tips="请下载IOS或Android版Google Authenticator扫码绑定"/>
  </div>
</template>
<script setup>
import useUserStore from '@/store/user';
import { rsaEncode } from '@/utils/common.js'
import { CircleCheck, Lock, User } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router';
import defaultPng from '@/assets/images/refresh.svg';
import { loginApi, checkTotpApi, bindTotpApi } from '@/api/login/index.js'
import QRCodeForm from '@/views/common/QRCodeForm.vue'

const defaultImg = ref(defaultPng);
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const qrcodeRef = ref();
const formData = ref({
  userName: null,
  pwd: null,
  verifyCode: null
});
const confirmData = ref({
  uuid: null,
  secretKey: null
});
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

getCode();

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
      }).then(({data: { data, state, uuid}}) => {
        if (state === 1) {
          loginSuccessHandle(data)
        } else {
          checkTotpHandle(uuid)
        }
      }).catch(() => {
        getCode();
      }).finally(() => {
        loading.value = false;
      });
    }
  });
};

const handleConfirm = () => {
  bindTotpApi({
    uid: confirmData.value.uuid,
    secretKey: confirmData.value.secretKey
  })
}

const checkTotpHandle = (uid) => {
  ElMessageBox.prompt('请输入动态口令', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /\D/,
    inputErrorMessage: '动态口令为6位数字',
    inputPlaceholder: '无动态口令请直接点击确认',
    inputValidator: (str) => {
      return str && str.length !== 6;
    }
  }).then(({ value }) => {
    checkTotpApi({
      uuid: uid,
      verifyCode: value
    }).then(({data: { data, state, uuid, secretKey, qrcode}}) => {
      if (state === 1) {
        loginSuccessHandle(data)
      } else {
        confirmData.value.uuid = uuid;
        confirmData.value.secretKey = secretKey;
        qrcodeRef.value.openDialog({ base64: qrcode, remark: '扫码完成后请按【绑定】按钮进行绑定'});
      }
    })
  })
};

const loginSuccessHandle = (data) => {
  userStore.user = {...data};
  const fullPath = route.fullPath;
  if (fullPath.startsWith('/login?redirect=')) {
    const path = getPath(fullPath.replace('/login?redirect=', ''))
    router.replace(path);
  } else {
    router.replace('/');
  }
};

/**
 * 因为浏览器原因或权限变更的原因, 可能会出现redirect的路径不在用户权限列表中, 则跳转到首页
 * @param path
 * @returns {string}
 */
const getPath = (path) => {
  const menuList = userStore.user?.menuList
  for (let menu of menuList) {
    for (let item of menu.children) {
      if (item.path === path) {
        return path;
      }
    }
  }
  return "/"
}

</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
  background:
    url('@/assets/images/background.png') repeat 1px 1px,
    linear-gradient(132deg, rgba(0, 168, 255, 1) 0%, rgba(0, 210, 211, 1) 50%, rgba(0, 168, 255, 1) 100%);
  background-blend-mode: multiply;

  .login-layout {
    width: 900px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.2);

    .login-layout-left {
      width: 500px;
      height: 100%;
      background-image: url('@/assets/images/login.png');
    }

    .login-layout-right {
      width: 400px;
      height: 100%;
      padding: 30px;
      display: grid;
      place-items: center;
      background-color: #fff;

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
    }
  }
}
</style>
