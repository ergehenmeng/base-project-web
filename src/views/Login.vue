<template>
  <div class="login-container">
    <div class="login-layout">
      <div class="login-layout-left"></div>
      <div class="login-layout-right">
        <div class="login-switch-tab">
          <a href="javascript:void(0);" :class="{ active: tabIndex === 0 }" @click="tabIndex = 0">密码登录</a>
          <a href="javascript:void(0);" :class="{ active: tabIndex === 1 }" @click="tabIndex = 1">短信登录</a>
        </div>
        <div class="login-form-container">
          <keep-alive>
            <AccountLoginForm v-if="tabIndex === 0" />
          </keep-alive>
          <keep-alive>
            <SmsLoginForm v-if="tabIndex === 1" />
          </keep-alive>
        </div>
        <div class="login-copyright"><span>© 2026 智能运营管理平台</span></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import AccountLoginForm from '@/views/common/AccountLoginForm.vue';
import SmsLoginForm from '@/views/common/SmsLoginForm.vue';

const tabIndex = ref(0);
</script>
<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;
  background: url('@/assets/images/background-square.png') center / cover no-repeat;

  .login-layout {
    width: 900px;
    height: 450px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.2);

    .login-layout-left {
      width: 500px;
      height: 100%;
      background: url('@/assets/images/login.png') center / cover no-repeat;
    }

    .login-layout-right {
      width: 400px;
      height: 100%;
      padding: 30px;
      display: grid;
      place-items: center;
      background-color: #fff;
      .login-switch-tab {
        margin-top: 10px;
        text-align: center;
        :first-child {
          border-right: 2px solid #e5e8ec;
        }
        a {
          color: #535c68;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          padding: 0 20px;
          line-height: 16px;
        }
        a.active {
          color: #409eff;
        }
      }
      .login-form-container {
        height: 300px;
        padding-top: 20px;
      }
      .login-copyright {
        color: #7d89a3;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}
</style>
