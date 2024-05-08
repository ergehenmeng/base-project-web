<script setup>
</script>
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

</template>
<style scoped>
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
</style>
