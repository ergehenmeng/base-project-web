<template>
  <div class="main-header">
    <ul>
      <li><el-icon title="修改密码" @click="changePwd">
          <Unlock />
        </el-icon></li>
      <li><el-icon title="退出系统" @click="logout">
          <CircleCloseFilled />
        </el-icon></li>
    </ul>
  </div>
</template>
<script setup>
import { CircleCloseFilled, Unlock } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';

const logout = ()=> {
  const userStore = useUserStore();
  userStore.logout();
}

</script>
<style lang='scss' scoped>
@import '@/styles/index.scss';

.main-header {
  height: 60px;
  background: url($main-header-logo-url) no-repeat 50px 5px, $main-header-color;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 30px;

  ul {
    list-style: none;
    display: inline-flex;
    li {
      color: white;
      margin-right: 10px;
      i {
        cursor: pointer;
      }
    }
  }
}
</style>
