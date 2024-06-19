<template>
  <div class="login-container">
    <div class="login-layout">
      <div class="login-layout-left"></div>
      <div class="login-layout-right">
        <h3>后台管理系统</h3>
        <el-form class="login-form" :rules="formRules" ref="formDataRef" :model="formData">
          <el-form-item prop="userName">
            <el-input
              placeholder="请输入账号"
              maxlength="20"
              v-model="formData.userName"
              size="large"
            >
              <template #prefix>
                <el-icon :size="20">
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input
              placeholder="请输入密码"
              v-model="formData.pwd"
              maxlength="20"
              size="large"
              type="password"
              show-password
              autocomplete="off"
            >
              <template #prefix>
                <el-icon :size="20">
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input
              placeholder="验证码"
              v-model="formData.verifyCode"
              maxlength="4"
              size="large"
              @keyup.enter="handleLogin"
              style="width: 60%"
            >
              <template #prefix>
                <el-icon :size="20">
                  <CircleCheck />
                </el-icon>
              </template>
            </el-input>
            <div class="login-form-verify">
              <img :src="verifyUrl" @click="getCode" alt="点击刷新" />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              style="width: 100%"
              size="large"
              type="primary"
              @click="handleLogin()"
              :loading="loading"
            >
              <span v-if="!loading">登录</span>
              <span v-else>登录中</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import useUserStore from '@/store/user';
import md5 from 'md5';
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const formData = ref({});
const formDataRef = ref();
const loading = ref(false);
const api = import.meta.env.VITE_API_URL;
const verifyUrl = ref('');
const getCode = () => {
  verifyUrl.value = api + '/manage/captcha?t=' + new Date().getTime();
};
getCode();
const formRules = reactive({
  userName: [
    { required: true, message: '账号不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur'
    }
  ],
  verifyCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
});

// 登录
const handleLogin = async () => {
  await formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      userStore
        .login({
          userName: formData.value.userName,
          pwd: md5(formData.value.pwd),
          verifyCode: formData.value.verifyCode
        })
        .then(() => {
          const fullPath = route.fullPath;
          if (fullPath.startsWith('/login?redirect=')) {
            router.replace(fullPath.replace('/login?redirect=', ''));
          } else {
            router.replace('/');
          }
        })
        .catch((e) => {
          console.log(e);
          getCode();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};
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
    linear-gradient(207deg, #3c8ce7, #00eaff);
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
