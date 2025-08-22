<template>
  <el-menu router unique-opened :default-active="activeIndex">
    <el-menu-item index="/home">
      <el-icon>
        <HomeFilled />
      </el-icon>
      <template #title>首页</template>
    </el-menu-item>
    <el-scrollbar height="calc(100vh - 120px)">
      <template v-for="item in menuList" :key="item.id">
        <!-- 首页不显示导航菜单而是直接上面写死 -->
        <el-sub-menu :index="item.path ? item.path : item.code" v-if="item.path !== '/home'">
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="item.icon"></component>
            </el-icon>
            {{ item.title }}
          </template>
          <template v-for="subItem in item.children" :key="subItem.id">
            <el-menu-item :index="subItem.path ? subItem.path : subItem.code">
              <template #title>
                <el-icon v-if="subItem.icon">
                  <component :is="subItem.icon"></component>
                </el-icon>
                {{ subItem.title }}
              </template>
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-scrollbar>
  </el-menu>
</template>
<script setup>
import useUserStore from '@/store/user';
import { useRoute } from 'vue-router';
import { HomeFilled } from '@element-plus/icons-vue'

const route = useRoute();
const userStore = useUserStore();
const menuList = userStore.user?.menuList;

// 获取当前要激活的菜单, 注意:如果url有3级,例如 /sys/help/create, 则激活的是 /sys/help,
// 因为create页面是独立的,此处不做特殊处理,默认是不会选中的
// 如果所有页面的新增编辑等页面都在一个页面(弹框),则不需要下面的特殊处理
const activeIndex = computed(() => {
  const pathList = route.path.split('/');
  if (pathList.length >= 4) {
    return `${pathList[0]}/${pathList[1]}/${pathList[2]}`;
  }
  return route.path;
});

</script>
<style lang="scss" scoped>
.el-menu-item.is-active {
  background-color: #ecf5ff;
}
</style>
