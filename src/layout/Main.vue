<template>
  <div class="main-center">
    <div class="main-navigation">
      <el-breadcrumb>
        <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbList" :key="index" :to="{path: breadcrumb.path}">
          {{ breadcrumb.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main-content">
      <el-scrollbar>
        <router-view @reloadBreadcrumb="reload"></router-view>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const breadcrumbList = ref([]);

const reload = (rows) => {
  breadcrumbList.value = rows;
}


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
