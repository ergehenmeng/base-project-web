<template>
  <el-cascader v-model="areaList" :options="options" :props="selectProps" clearable filterable :disabled="props.disabled"> </el-cascader>
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
  }
});
const areaList = defineModel({
  type: Array,
  required: true
});
</script>
<style lang="scss" scoped></style>