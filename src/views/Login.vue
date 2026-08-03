<template>
  <div class="login-container">
    <div class="login-layout">
      <div class="login-layout-left"></div>
      <div class="login-layout-right">
        <div class="login-switch-tab" :class="{ 'is-sms': tabIndex === 1 }">
          <a href="javascript:void(0);" :class="{ active: tabIndex === 0 }" @click="tabIndex = 0">密码登录</a>
          <a href="javascript:void(0);" :class="{ active: tabIndex === 1 }" @click="tabIndex = 1">短信登录</a>
        </div>
        <div class="login-form-container">
          <Transition :name="tabIndex === 0 ? 'form-slide-right' : 'form-slide-left'" mode="out-in">
            <KeepAlive>
              <component :is="tabIndex === 0 ? AccountLoginForm : SmsLoginForm" />
            </KeepAlive>
          </Transition>
        </div>
        <div class="login-copyright"><span>{{ systemName }}</span></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import AccountLoginForm from '@/views/common/AccountLoginForm.vue';
import SmsLoginForm from '@/views/common/SmsLoginForm.vue';
const tabIndex = ref(0);
const systemName = import.meta.env.VITE_SYSTEM_NAME;
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
        position: relative;
        margin-top: 10px;
        text-align: center;
        &::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 20px;
          width: calc(50% - 40px);
          height: 2px;
          border-radius: 2px;
          background-color: #409eff;
          transition: transform 220ms ease-in-out;
        }
        &.is-sms::after {
          transform: translateX(calc(100% + 40px));
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
      .form-slide-left-enter-active,
      .form-slide-left-leave-active,
      .form-slide-right-enter-active,
      .form-slide-right-leave-active {
        transition:
          opacity 280ms ease-in-out,
          transform 280ms cubic-bezier(0.65, 0, 0.35, 1);
      }
      .form-slide-left-enter-from,
      .form-slide-right-leave-to {
        opacity: 0;
        transform: translate3d(32px, 0, 0);
      }
      .form-slide-left-leave-to,
      .form-slide-right-enter-from {
        opacity: 0;
        transform: translate3d(-32px, 0, 0);
      }
      .login-copyright {
        color: #7d89a3;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .form-slide-left-enter-active,
  .form-slide-left-leave-active,
  .form-slide-right-enter-active,
  .form-slide-right-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
