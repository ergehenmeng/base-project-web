<template>
  <!-- 登录后的页面 -->
  <Main v-if="isLogin"></Main>
  <!-- 登录页面 -->
  <router-view v-if="!isLogin" name="fullScreen"></router-view>
</template>
<script setup>
import Main from '@/layout/Main.vue';
import useUserStore from '@/store/user';
const userStore = useUserStore();
const { isLogin } = toRefs(userStore);
</script>

