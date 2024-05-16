<template>
  <el-container class="login-container">
    <el-main class="login-layout-form">
      <div class="login-form-label">
        <h3 class="login-title">后台管理系统</h3>
        <el-form class="login-form" :rules="formRules" ref="formDataRef" :model="formData">
          <el-form-item prop="userName">
            <el-input placeholder="请输入账号" maxlength="20" v-model="formData.userName" size="large">
              <template #prefix>
                <el-icon :size="20">
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input placeholder="请输入密码" v-model="formData.pwd" maxlength="20" size="large" type="password"
              show-password autocomplete="off">
              <template #prefix>
                <el-icon :size="20">
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input placeholder="验证码" v-model="formData.verifyCode" maxlength="4" size="large"
              @keyup.enter="handleLogin" style="width: 60%;">
              <template #prefix>
                <el-icon :size="20">
                  <CircleCheck />
                </el-icon>
              </template>
            </el-input>
            <div class="verfiy-layout">
              <img :src="verifyUrl" @click="getCode">
            </div>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%;" size="large" type="primary" @click="handleLogin()" :loading="loading">
              <span v-if="!loading">登录</span>
              <span v-else>登录中</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>
<script setup>
import useUserStore from '@/store/user';
import { CircleCheck, Lock, User } from '@element-plus/icons-vue';
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const formData = ref({})
const formDataRef = ref();
const loading = ref(false)
const verifyUrl = ref('');
const formRules = reactive({
  userName: [
    { required: true, message: '账号不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'
    }],
  verifyCode: [
    { required: true, message: '验证码不能为空', trigger: 'blur' }
  ]
})

const api = import.meta.env.VITE_API_URL;
const getCode = () => {
  verifyUrl.value = api + "/manage/captcha?t=" + new Date().getTime();
}
onMounted(() => getCode());

// 登录
const handleLogin = async () => {
  await formDataRef.value.validate(valid => {
    if (valid) {
      loading.value = true;
      const userStore = useUserStore()
      userStore.login({ ...formData.value })
        .then(() => {
          const fullPath = useRoute().fullPath;
          if (fullPath.startsWith("/login?redirect=") !== -1) {
            useRouter().push(fullPath.replace("/login?redirect=", ""));
          } else {
            useRouter().push("/");
          }
        })
        .catch(() => getCode())
        .finally(() => {
          loading.value = false;
        })
    }
  });
}

</script>

<style lang="scss" scoped>
.login-container {
  background-image: url(@/assets/images/background.png);
}

.login-layout-form {
  height: 900px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form-label {
  padding: 30px;
  border: 1px solid #ddd;
  background-color: #EEE
}

.verfiy-layout {
  float: right;
  padding-left: 10px;

  img {
    height: 38px;
    vertical-align: middle;
    cursor: pointer;
  }
}

.login-title {
  text-align: center;
}

.login-form {
  width: 280px;
}
</style>
