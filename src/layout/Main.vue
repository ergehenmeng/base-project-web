<template>
  <div class="main-center">
    <div class="main-navigation">
      <el-breadcrumb>
        <template v-for="(breadcrumb, index) in breadcrumbList" :key="index">
          <el-breadcrumb-item v-if="index !== 0 && index !== 1 && index !== breadcrumbList.length - 1" :to="breadcrumb?.path">
            {{ breadcrumb.meta?.title }}
          </el-breadcrumb-item>
          <el-breadcrumb-item v-else>{{ breadcrumb.meta?.title }}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <div class="main-content">
      <el-scrollbar>
        <router-view></router-view>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import useBreadcrumbStore from '@/store/breadcrumb';

const breadcrumbStore = useBreadcrumbStore();
const breadcrumbList = computed(() => {
  return breadcrumbStore.breadcrumb;
});
</script>

<style lang="scss" scoped>
.main-navigation {
  padding: 10px;
}

.main-center,
.main-content {
  padding: 10px 10px 0 10px;
}
</style>
