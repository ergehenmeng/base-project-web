<template>
  <el-select v-model="storeId" :disabled="props.disabled" :clearable="props.clearable" filterable>
    <el-option v-for="item in storeList" :key="item.storeId" :value="item.storeId" :label="item.storeName" :disabled="item.state === 2 || item.storeName === null">
      <span style="float: left">{{ item.storeName === null ? '未命名' : item.storeName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.state === 0 ? '未上架' : item.state === 2 ? '强制下架' : '已上架' }}</span>
    </el-option>
  </el-select>
</template>
<script setup>
import { storeListApi } from '@/api/product/store';

const storeList = ref([]);

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
const storeId = defineModel();

onMounted(() => {
  storeListApi().then((res) => {
    storeList.value = res.data;
  });
});
</script>
