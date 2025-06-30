<template>
  <el-select v-model="state" :clearable="props.clearable" class="w110">
    <el-option label="待支付" :value="0" v-if="!props.exclude.includes(0)"/>
    <el-option label="支付中" :value="1" v-if="!props.exclude.includes(1)"/>
    <el-option label="待使用" :value="2" v-if="!props.exclude.includes(2)"/>
    <el-option label="待自提" :value="3" v-if="!props.exclude.includes(3)"/>
    <el-option label="待发货" :value="4" v-if="!props.exclude.includes(4)"/>
    <el-option label="待收货" :value="5" v-if="!props.exclude.includes(5)"/>
    <el-option label="待成团" :value="6" v-if="!props.exclude.includes(6)"/>
    <el-option label="订单完成" :value="7" v-if="!props.exclude.includes(7)"/>
    <el-option label="已关闭" :value="8" v-if="!props.exclude.includes(8)"/>
  </el-select>
</template>
<script setup>
const props = defineProps({
  clearable: {
    type: Boolean,
    default: true
  },
  exclude: {
    type: Array,
    default: []
  }
});
const state = defineModel();
</script>
