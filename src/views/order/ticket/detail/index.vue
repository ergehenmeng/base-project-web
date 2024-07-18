<template>
  <div class="edit-content">
    <el-divider />
    <CustomTag></CustomTag>
    <div>
      <div class="edit-button-footer" >
        <el-button @click="goBack($router)">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomTag from '@/components/CustomTag.vue'
import { goBack } from '@/utils/common.js'
</script>
<style lang="scss" scoped>
</style>