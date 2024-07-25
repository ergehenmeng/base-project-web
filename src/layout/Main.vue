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
import useDictStore from '@/store/dict';
import useAreaStore from '@/store/area.js';

const areaStore = useAreaStore();
areaStore.initArea();

const dictStore = useDictStore();
dictStore.initDict('image_type', 'help_type', 'feedback_type', 'banner_type', 'notice_type', 'scenic_tag', 'homestay_tag', 'key_service', 'infrastructure_tag');

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
