<template>
  <div class="main-center">
    <div class="main-navigation">
      <el-breadcrumb>
        <el-breadcrumb-item>一级</el-breadcrumb-item>
        <el-breadcrumb-item>二级</el-breadcrumb-item>
        <el-breadcrumb-item>三级</el-breadcrumb-item>
        <el-breadcrumb-item>四级</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main-content">
      <el-scrollbar>
        <Content />
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import Content from '@/layout/Content.vue'

</script>
<style lang='scss' scoped>
.main-navigation {
  padding: 10px;
}

.main-center,
.main-content {
  padding: 10px 10px 0px 10px;
}
</style>
