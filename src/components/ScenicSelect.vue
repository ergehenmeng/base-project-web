<template>
  <el-select v-model="scenicId" :disabled="props.disabled" :clearable="props.clearable" filterable>
    <el-option v-for="item in scenicList" :key="item.id" :value="item.id" :label="item.scenicName" :disabled="item.state === 2 || item.scenicName === null">
      <span style="float: left">{{ item.scenicName === null ? '未命名' : item.scenicName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.state === 0 ? '未上架' : item.state === 2 ? '强制下架' : '已上架' }}</span>
    </el-option>
  </el-select>
</template>
<script setup>
import { listApi } from '@/api/product/scenic';

const scenicList = ref([]);

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
});
const scenicId = defineModel();

onMounted(() => {
  listApi().then((res) => {
    scenicList.value = res.data;
  });
});
</script>