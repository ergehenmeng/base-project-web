<template>
  <el-cascader v-model="areaList" :options="options" :props="selectProps" :clearable="clearable" filterable :disabled="props.disabled" ></el-cascader>
</template>
<script setup>
import useAreaStore from '@/store/area.js';

const areaStore = useAreaStore();

const options = areaStore.areaList;

const selectProps = {
  expandTrigger: 'hover',
  label: 'title',
  value: 'id'
};

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
const areaList = defineModel({
  type: Array,
  default: () => []
});
</script>
