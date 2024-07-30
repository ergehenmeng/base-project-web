<template>
  <el-container class="main-container" v-if="isLogin" >
    <el-header class="main-header">
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
import LockScreen from '@/views/LockScreen.vue'

const userStore = useUserStore();
const { isLogin } = toRefs(userStore);
const lockRef = ref();

const handleLockScreen = () => {
  lockRef.value.openDialog();
}

const keyupListener = (e) => {
  if (e.altKey && e.key === 'l') {
    handleLockScreen();
  }
}

onMounted(() => {
  if (userStore.user?.isLock) {
    handleLockScreen();
  }
  window.addEventListener("keyup", keyupListener)
})

onUnmounted(() => {
  window.removeEventListener("keyup", keyupListener)
})

</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.main-header {
  background:
    url($main-header-logo-url) no-repeat 50px 5px,
    $main-header-color;
}
</style>
