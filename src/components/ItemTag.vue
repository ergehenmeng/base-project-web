<template>
  <el-cascader v-model="tagId" :options="options" :props="selectProps" clearable filterable :disabled="props.disabled" ></el-cascader>
</template>
<script setup>
import { listApi } from '@/api/config/itemTag/index.js';

const options = ref([]);

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
const tagId = defineModel({
  type: Array,
  default: () => []
});

onMounted(() => {
  listApi().then((res) => {
    options.value = res.data;
  });
});
</script>
