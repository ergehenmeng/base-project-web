<template>
  <el-watermark :content="userStore.user?.userName" :font="font">
    <el-container class="main-container" v-if="isLogin">
      <el-header class="main-header">
        <div class="logo">
          <span class="logo-text">{{ userStore.user?.systemName }}</span>
        </div>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Aside></Aside>
        </el-aside>
        <el-main style="height: calc(100vh - 60px)">
          <Main></Main>
        </el-main>
      </el-container>
    </el-container>
  </el-watermark>
  <!-- fullScreen:需要全屏显示的页面 -->
  <router-view v-if="!isLogin" name="fullScreen"></router-view>
  <LockScreen ref="lockRef"></LockScreen>
</template>
<script setup>
import Header from '@/layout/Header.vue';
import Aside from '@/layout/Aside.vue';
import Main from '@/layout/Main.vue';
import useUserStore from '@/store/user';
import LockScreen from '@/views/LockScreen.vue';

const userStore = useUserStore();
const { isLogin } = toRefs(userStore);
const lockRef = ref();

const refreshToast = (e) => {
  e.preventDefault();
  e.returnValue = '';
};

const handleLockScreen = () => {
  window.addEventListener('beforeunload', refreshToast);
  lockRef.value.openDialog();
};

const keyupListener = (e) => {
  if (e.altKey && e.key === 'l') {
    handleLockScreen();
  }
};

const font = reactive({
  color: 'rgba(0, 0, 0, .05)',
  fontSize: 14
})

onMounted(() => {
  if (userStore.user?.isLock) {
    handleLockScreen();
  }
  window.addEventListener('keyup', keyupListener);
});

onUnmounted(() => {
  window.removeEventListener('keyup', keyupListener);
  window.removeEventListener('beforeunload', refreshToast);
});
</script>

<style lang="scss" scoped>
@use '@/styles/index.scss' as vars;

.main-header {
  background: vars.$main-header-color;
  display: flex;
  justify-content: space-between;
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 40px;
    .logo-text {
      text-align: center;
      font-size: 32px;
      display: block;
      color: white;
      font-family: 'STXingkai', 'STLiti', cursive, Arial, sans-serif;
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* IE 10+ */
      user-select: none;
    }
  }
}
</style>
