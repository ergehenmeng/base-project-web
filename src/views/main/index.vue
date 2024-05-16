<template>
  <el-container>
    <el-header class="main-header">
      <router-view name="header"></router-view>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu background-color="#dfe4ea" text-color="#fff" active-text-color="#a4b0be">
          <el-sub-menu index="1">
            <template #title>Workspace</template>
            <el-menu-item index="1">1</el-menu-item>
            <el-menu-item index="2">2</el-menu-item>
            <el-menu-item index="3">3</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>main</el-main>
    </el-container>
  </el-container>
</template>
<script setup>

</script>

<style lang="scss" scoped>

@import '@/styles/index.scss';

.main-header {
  background: url('@/assets/images/logo.png') no-repeat 50px 5px, $main-header-color;
}
</style>
