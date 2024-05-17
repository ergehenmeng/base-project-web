<template>
  <div>
    <div class="search">
      <el-form ref="form" :inline="true" label-width="80px">
        <el-form-item label="搜索">
          <el-input v-model="search" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="请选择" size="normal">
          <el-select placeholder="请选择">
            <el-option label="全部" value="0" />
            <el-option label="标题" value="1" />
            <el-option label="内容" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group"></div>
  </div>
</template>
<script setup>
</script>
<style lang='scss' scoped>
.search {
  padding: 10px 5px 0 5px;
  border-radius: 5px;
  background-color: #fff;

  .el-form-item {

    .el-input,
    .el-select {
      width: 200px;
    }
  }

}
</style>
