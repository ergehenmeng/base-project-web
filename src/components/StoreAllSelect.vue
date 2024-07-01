<template>
  <el-select v-model="storeIds" :disabled="props.disabled" :clearable="props.clearable" filterable :multiple="multiple" :collapse-tags="multiple" collapse-tags-tooltip>
    <el-option v-for="item in storeList" :key="item.storeId" :value="item.storeId" :label="item.storeName" :disabled="item.state === 2 || item.storeName === null">
      <span style="float: left">{{ item.storeName === null ? '未命名' : item.storeName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px"
        >{{ parseType(item.productType) }}
        <span v-if="item.state === 0">未上架</span>
        <span style="color: green" v-else-if="item.state === 1">已上架</span>
        <span style="color: red" v-else>强制下架</span>
      </span>
    </el-option>
  </el-select>
</template>
<script setup>
import { parseProductType } from '@/utils/common.js';

const storeList = defineModel('storeList', {
  default: () => [],
  type: Array
});

const storeIds = defineModel('storeIds', {
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
    return '(' + parseProductType(type) + ')';
  };
});
</script>
