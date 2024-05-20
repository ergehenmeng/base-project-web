<template>
  <el-menu router>
    <el-menu-item index="/home">
      <el-icon>
        <HomeFilled />
      </el-icon>
      <template #title>首页</template>
    </el-menu-item>
    <el-scrollbar height="calc(100vh - 120px)">
      <template v-for="(item) in menuList" :key="item.id">
        <el-sub-menu :index="item.code">
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <template #title>{{ item.title }}</template>
          <template v-for="(subItem) in item.children" :key="subItem.id">
            <el-menu-item :index="item.code">{{ subItem.title }}</el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-scrollbar>
  </el-menu>
</template>
<script setup>
import useUserStore from '@/store/user';
const userStore = useUserStore();

const menuList = userStore.user.menuList;

</script>
<style lang='scss' scoped>
.el-menu-item.is-active {
  background-color: #ecf5ff;
}
</style>
