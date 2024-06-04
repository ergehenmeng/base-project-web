<template>
  <el-cascader v-model="selectedValue" :options="options" :props="selectProps" clearable filterable>

  </el-cascader>
</template>
<script setup>
import useAreaStore from "@/store/area.js";

const areaStore = useAreaStore();

const options = areaStore.areaList;

const selectProps = {
  expandTrigger: 'hover',
  label: "title",
  value: "id"
}

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  }
});
const selectedValue = defineModel({
  type: Array,
  required: true
});

</script>
<style lang="scss" scoped>
</style>