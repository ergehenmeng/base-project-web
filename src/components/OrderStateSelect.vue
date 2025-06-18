<template>
  <el-select v-model="orderState" :clearable="props.clearable">
    <el-option label="待支付" :value="0" />
    <el-option label="支付中" :value="1" />
    <el-option label="待成团" :value="11" />
    <el-option label="待使用" :value="2" />
    <el-option label="待自提" :value="3" />
    <el-option label="待发货" :value="4" />
    <el-option label="待收货" :value="5" />
    <el-option label="退款中" :value="6" />
    <el-option label="订单完成" :value="7" />
    <el-option label="已关闭" :value="8" />
    <el-option label="支付异常" :value="9" />
    <el-option label="退款异常" :value="10" />
  </el-select>
</template>
<script setup>
const props = defineProps({
  clearable: {
    type: Boolean,
    default: true
  }
});
const orderState = defineModel();
</script>
