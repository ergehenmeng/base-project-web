<template>
  <el-select v-model="expressId" :clearable="props.clearable" filterable>
    <el-option v-for="item in expressList" :key="item.id" :label="item.title" :value="item.id" :disabled="props.disabled || item.state === 0">
      <span style="float: left">{{ item.title }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">计费方式: {{ item.chargeMode === 1 ? '按件数' : '按重量' }}</span>
    </el-option>
  </el-select>
</template>
<script setup>
import { selectListApi } from '@/api/product/express';

const expressList = ref([]);

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
const expressId = defineModel();

onMounted(() => {
  selectListApi().then((res) => {
    expressList.value = res.data;
  });
});
</script>
