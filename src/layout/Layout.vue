<template>
  <el-container class="main-container" v-if="isLogin">
    <el-header class="main-header">
      <div class="logo">
        <span class="logo-text">{{ systemName }}</span>
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
const systemName = import.meta.env.VITE_SYSTEM_NAME;
const handleLockScreen = () => {
  lockRef.value.openDialog();
};

const keyupListener = (e) => {
  if (e.altKey && e.key === 'l') {
    handleLockScreen();
  }
};

onMounted(() => {
  if (userStore.user?.isLock) {
    handleLockScreen();
  }
  window.addEventListener('keyup', keyupListener);
});

onUnmounted(() => {
  window.removeEventListener('keyup', keyupListener);
});
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.main-header {
  background: $main-header-color;
  display: flex;
  justify-content: space-between;
  .logo {
    margin-left: 40px;
    .logo-text {
      font-size: 36px;
      color: white;
      font-family: 'Viner Hand ITC', 'Brush Script MT', 'Snell Roundhand', Schoolbell, Pacifico, cursive, Arial, sans-serif;
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* IE 10+ */
      user-select: none;
    }
  }
}
</style>
