<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Sider</el-aside>
        <el-main>main</el-main>
      </el-container>
    </el-container>
  </div>
  <el-icon>
    <i-ep-edit />
  </el-icon>
  <el-row>
    <el-col :span="24">
      <div class="grid-content ep-bg-purple-dark"></div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <div class="grid-content ep-bg-purple"></div>
    </el-col>
    <el-col :span="12">
      <div class="grid-content ep-bg-purple-light"></div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="8">
      <div class="grid-content ep-bg-purple"></div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content ep-bg-purple-light"></div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content ep-bg-purple"></div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="6">
      <div class="grid-content ep-bg-purple"></div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content ep-bg-purple-light"></div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content ep-bg-purple"></div>
    </el-col>
    <el-col :span="6">
      <div class="grid-content ep-bg-purple-light"></div>
    </el-col>
  </el-row>
  <el-row :gutter="20" justify="center">
    <el-col :span="4">
      <div class="grid-content ep-bg-purple"></div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple-light"></div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple"></div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple-light"></div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple"></div>
    </el-col>
    <el-col :span="4">
      <div class="grid-content ep-bg-purple-light"></div>
    </el-col>
  </el-row>
  <el-scrollbar height="200px">
    <p v-for="item in 20" class="item-scrollbar">{{ item }}</p>
  </el-scrollbar>

  <el-scrollbar>
    <div class="scrollbar-flex-content">
      <p class="item-scrollbar-button" v-for="(item, index) in 20" :key="index">{{ item }}</p>
    </div>
  </el-scrollbar>
  <el-button-group>
    <el-button type="primary" @click="add">加</el-button>
    <el-button type="primary" @click="sub">减</el-button>
  </el-button-group>

  <el-scrollbar max-height="200px">
    <p v-for="item in count" class="item-scrollbar">{{ item }}</p>
  </el-scrollbar>
</template>
<script setup>
import { ref } from 'vue';
import useUserStore from '@/store/user'

const userStore = useUserStore()

userStore.login({
  userName: "13000000000",
  pwd: "e10adc3949ba59abbe56e057f20f883e",
  verifyCode: "123"
})

const count = ref(3)
const add = () => { count.value++ }
const sub = () => {
  if (count.value > 0) {
    count.value--
  }
}

</script>
<style scoped>
.item-scrollbar-button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.scrollbar-flex-content {
  display: flex;
}

.item-scrollbar {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.common-layout .el-header {
  background-color: #79f1f3;
  color: #000;
  text-align: center
}

.common-layout .el-aside {
  background-color: #2eb8f3;
  color: #000;
  text-align: center
}

.common-layout .el-main {
  background-color: #a5e7f3;
  color: #000;
  text-align: center
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.ep-bg-purple-dark {
  background: #99a9bf;
}

.ep-bg-purple {
  background: #d3dce6;
}

.ep-bg-purple-light {
  background: #e5e9f2;
}
</style>
