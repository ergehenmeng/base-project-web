<template>
  <div class="main-center">
    <div class="main-navigation">
      <el-breadcrumb>
        <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbList" :key="index" :to="{ path: breadcrumb?.path }">
          {{ breadcrumb.meta?.title }}
        </el-breadcrumb-item>
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
import { computed } from 'vue';
import useDictStore from '@/store/dict';

const dictStore = useDictStore();
dictStore.initDict("image_type", "help_type", "feedback_type");

const breadcrumbStore = useBreadcrumbStore();
const breadcrumbList = computed(() => {
  return breadcrumbStore.breadcrumb;
})

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
