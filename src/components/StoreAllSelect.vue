<template>
  <el-select v-model="storeIds" :disabled="props.disabled" :clearable="props.clearable" filterable :multiple="multiple" :collapse-tags="multiple">
    <el-option v-for="item in storeList" :key="item.storeId" :value="item.storeId" :label="item.storeName" :disabled="item.state === 2 || item.storeName === null">
      <span style="float: left">{{ item.storeName === null ? '未命名' : item.storeName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{parseType(item.productType)}}{{ item.state === 0 ? '未上架' : item.state === 2 ? '强制下架' : '已上架' }}</span>
    </el-option>
  </el-select>
</template>
<script setup>
import { storeApi } from '@/api/product';
import { parseProductType } from '@/utils/common.js'

const storeList = defineModel("storeList",{
  default: () => [],
  type: Array
});

const storeIds = defineModel("storeIds", {
  default: () => [],
  type: Array
});

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: false
  }
});

const parseType = computed(() => {
  return (type) => {
    return "(" + parseProductType(type) + ")";
  }
})

onMounted(() => {
  if (storeList.value.length === 0) {
    storeApi().then(res => {
      storeList.value = res.data;
    })
  }
});

</script>
