<template>
  <div class="main-header">
    <span class="main-header-title">欢迎您: {{ nickName }}</span>
    <ul>
      <li><el-icon title="个人中心" @click="changePwd">
          <UserFilled />
        </el-icon>
      </li>
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
import useUserStore from '@/store/user';

const userStore = useUserStore();

const nickName = userStore.user.nickName;

const logout = () => {
  ElMessageBox.confirm("确定要退出系统吗?").then(() => {
    const userStore = useUserStore();
    userStore.logout();
  })
}

const changePwd = () => {

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
  .main-header-title {
    color: white;
    font-size: 15px;
    font-weight: bold;
    margin-right: 20px;
    padding-bottom: 2px;
  }
}
</style>
