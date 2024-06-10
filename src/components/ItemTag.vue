<template>
  <el-cascader v-model="tagId" :options="options" :props="selectProps" clearable filterable :disabled="props.disabled" :show-all-levels="false">
  </el-cascader>
</template>
<script setup>
import {listApi} from "@/api/config/tag/index.js";

const options = ref([]);

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
const tagId = defineModel({
  type: Array,
  required: true
});

onMounted(() => {
  listApi().then(res => {
    options.value = res.data.list;
  })
})

</script>