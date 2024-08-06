<template>
  <el-select v-model="couponId" :disabled="props.disabled" :clearable="props.clearable" filterable>
    <el-option v-for="item in couponList" :key="item.id" :value="item.id" :label="item.title" >
      <span style="float: left">{{ item.title }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.state === 1 ? '启用' : '禁用' }}</span>
    </el-option>
  </el-select>
</template>
<script setup>
import { grantListApi } from '@/api/marketing/coupon';

const couponList = ref([]);

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  }
});
const couponId = defineModel();

onMounted(() => {
  grantListApi().then((res) => {
    couponList.value = res.data;
  });
});

defineExpose({
  couponList
});
</script>
