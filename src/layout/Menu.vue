<template>
  <el-menu router >
    <el-menu-item index="0">
      <el-icon><HomeFilled /></el-icon>
      <template #title>首页</template>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>Workspace</template>
      <el-menu-item index="1">1</el-menu-item>
      <el-menu-item index="2">2</el-menu-item>
      <el-menu-item index="3" v-has-perm="'xx'">3</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
<script setup>
import { HomeFilled } from '@element-plus/icons-vue'
</script>
<style lang='scss' scoped>
.el-menu-item.is-active {
  background-color: #ecf5ff;
}
</style>
