<template>
  <div>
    <div class="search">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="搜索">
          <el-input v-model="formRef.search" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-group"></div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'

const formRef = reactive({
  search: ""
})

const search = () => {
  console.log(formRef.search)
}

const reset = () => {
  formRef.search = ""
}

</script>
<style lang='scss' scoped>
.search {
  border-radius: 3px;
  background-color: #fff;
  padding-top: 18px;
}
</style>
