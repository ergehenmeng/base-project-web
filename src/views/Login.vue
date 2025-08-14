<template>
  <div class="login-container">
    <div class="login-layout">
      <div class="login-layout-left"></div>
      <div class="login-layout-right">
        <div class="login-switch-tab">
          <a href="javascript:void(0);" :class="{'active': tabIndex === 0}" @click="tabIndex = 0">密码登录</a>
          <a href="javascript:void(0);" :class="{'active': tabIndex === 1}" @click="tabIndex = 1">短信登录</a>
        </div>
        <div class="login-form-container">
          <div>
            <AccountLoginForm v-if="tabIndex === 0" />
          </div>
          <div>
            <SmsLoginForm v-show="tabIndex === 1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import AccountLoginForm from '@/views/common/AccountLoginForm.vue'
import SmsLoginForm from '@/views/common/SmsLoginForm.vue'

const tabIndex = ref(0);
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
        padding-top: 30px;
      }
    }
  }
}
</style>
