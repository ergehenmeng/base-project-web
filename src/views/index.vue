<template>
  <el-container class="main-container" v-show="isLogin">
    <el-header class="main-header">
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Menu></Menu>
      </el-aside>
      <el-main style="height: calc(100vh - 60px);">
        <Center></Center>
      </el-main>
    </el-container>
  </el-container>
  <router-view v-if="!isLogin"></router-view>
</template>
<script setup>
import Header from "@/layout/Header.vue"
import Menu from "@/layout/Menu.vue"
import Center from "@/layout/Center.vue"
import useUserStore from "@/store/user";

const { isLogin } = toRefs(useUserStore());

</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.main-header {
  background: url($main-header-logo-url) no-repeat 50px 5px, $main-header-color;
}

.main-container {
  background-color: #ebebeb;
}
</style>
