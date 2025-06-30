<template>
  <el-select v-model="refundState" :clearable="props.clearable" class="w120">
    <el-option label="未退款" :value="0" />
    <el-option label="退款申请中" :value="1" />
    <el-option label="退款中" :value="2" />
    <el-option label="退款拒绝" :value="3" />
    <el-option label="退款成功" :value="4" />
    <el-option label="退款失败" :value="5" />
  </el-select>
</template>
<script setup>
const props = defineProps({
  clearable: {
    type: Boolean,
    default: true
  }
});
const refundState = defineModel();
</script>
