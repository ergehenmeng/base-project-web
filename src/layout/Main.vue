<template>
  <el-container class="main-container" v-loading.fullscreen.lock="!ready">
    <el-header class="main-header">
      <div class="logo">
        <span class="logo-text">{{ userStore.user?.systemName }}</span>
      </div>
      <Header v-if="ready"></Header>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Aside v-if="ready"></Aside>
      </el-aside>
      <el-main style="height: calc(100vh - 60px)">
        <Content v-if="ready"></Content>
      </el-main>
    </el-container>
  </el-container>
  <LockScreen ref="lockRef"></LockScreen>
</template>
<script setup>
import { permApi } from '@/api/login/index.js';
import Header from '@/layout/Header.vue';
import Aside from '@/layout/Aside.vue';
import Content from '@/layout/Content.vue';
import LockScreen from '@/views/LockScreen.vue';
import useUserStore from '@/store/user';

const lockRef = ref();
const ready = ref(false);
const userStore = useUserStore();
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

onMounted(() => {
  if (userStore.user?.isLock) {
    handleLockScreen();
  }
  window.addEventListener('keyup', keyupListener);
  permApi().then(({data: { permList, menuList }}) => {
    userStore.user.permList = permList;
    userStore.user.menuList = menuList;
    ready.value = true;
  }).catch(() => {
    userStore.logout();
  });
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