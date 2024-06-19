<template>
  <el-select v-model="restaurantId" :disabled="props.disabled" :clearable="props.clearable">
    <el-option v-for="item in restaurantList" :key="item.id" :value="item.id" :label="item.title" :disabled="item.state === 2 || item.title === null">
      <span style="float: left">{{ item.title === null ? '未命名' : item.title }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.state === 0 ? '未上架' : item.state === 2 ? '强制下架' : '已上架' }}</span>
    </el-option>
  </el-select>
</template>
<script setup>
import { listApi } from '@/api/product/restaurant';

const restaurantList = ref([]);

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
const restaurantId = defineModel();

onMounted(() => {
  listApi().then((res) => {
    restaurantList.value = res.data;
  });
});
</script>