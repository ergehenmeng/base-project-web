<template>
  <el-watermark :content="content" :font="font">
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
  </el-watermark>
</template>
<script setup>
import useBreadcrumbStore from '@/store/breadcrumb';

const breadcrumbStore = useBreadcrumbStore();
const breadcrumbList = computed(() => {
  return breadcrumbStore.breadcrumb;
});

const content = computed(() => {
  return ["E", "G", "H", "M"].join("");
});

const font = reactive({
  color: 'rgba(0, 0, 0, .05)',
  fontSize: 14
})

</script>
<style lang="scss" scoped>
.main-navigation {
  padding: 10px;
}

.main-center,
.main-content {
  padding: 10px 10px 0px 10px;
}
</style>
