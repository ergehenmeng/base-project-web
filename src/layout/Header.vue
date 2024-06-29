<template>
  <div class="main-header">
    <ul class="">
      <li>
        <span class="main-header-title">欢迎您: {{ nickName }}</span>
      </li>
      <li>
        <el-icon title="个人中心" @click="handleUser">
          <User color="#FFFFFF"></User>
        </el-icon>
      </li>
      <li>
        <el-icon title="修改密码" @click="handleChangePwd">
          <Password color="#FFFFFF"></Password>
        </el-icon>
      </li>
      <li>
        <el-icon title="退出系统" @click="handleLogout">
          <Logout color="#FFFFFF"></Logout>
        </el-icon>
      </li>
    </ul>
    <ChangePwd ref="changePwdRef"></ChangePwd>
  </div>
</template>
<script setup>
import useUserStore from '@/store/user';
import ChangePwd from '@/views/ChangePwd.vue';
import { confirmMsg } from '@/utils/message';
import Logout from '@/components/icon/Logout.vue';
import Password from '@/components/icon/Password.vue';
import User from '@/components/icon/User.vue';

const userStore = useUserStore();
const changePwdRef = ref();
const nickName = userStore.user?.nickName;

const handleLogout = () => {
  confirmMsg('确定要退出系统吗?', () => {
    userStore.logout();
  });
};

const handleUser = () => {};

const handleChangePwd = () => {
  changePwdRef.value.openDialog();
};
</script>
<style lang="scss" scoped>
@import '@/styles/index.scss';

.main-header {
  height: 60px;
  background:
    url($main-header-logo-url) no-repeat 50px 5px,
    $main-header-color;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 30px;

  ul {
    list-style: none;
    display: inline-flex;
    li {
      color: white;
      margin: auto 5px;
      i {
        margin-top: 5px;
        cursor: pointer;
        font-size: 15px;
      }
    }
  }

  .main-header-title {
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
