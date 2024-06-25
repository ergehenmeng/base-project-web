<template>
  <el-select v-model="areaCode" :disabled="props.disabled" :clearable="props.clearable">
    <el-option v-for="item in areaList" :key="item.code" :value="item.code" :label="item.title"> </el-option>
  </el-select>
</template>
<script setup>
import { listApi } from '@/api/poi/area';

const areaList = ref([]);

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
const areaCode = defineModel();

onMounted(() => {
  listApi().then((res) => {
    areaList.value = res.data;
  });
});
</script>
