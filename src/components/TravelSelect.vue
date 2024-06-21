<template>
  <el-select v-model="travelId" :disabled="props.disabled" :clearable="props.clearable" filterable>
    <el-option v-for="item in travelList" :key="item.id" :value="item.id" :label="item.title" :disabled="item.state === 2 || item.title === null">
      <span style="float: left">{{ item.title === null ? '未命名' : item.title }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.state === 0 ? '未上架' : item.state === 2 ? '强制下架' : '已上架' }}</span>
    </el-option>
  </el-select>
</template>
<script setup>
import { listApi } from '@/api/product/travel';

const travelList = ref([]);

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
const travelId = defineModel();

onMounted(() => {
  listApi().then((res) => {
    travelList.value = res.data;
  });
});
</script>