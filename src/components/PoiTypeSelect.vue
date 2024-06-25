<template>
  <el-select v-model="typeId" :disabled="props.disabled" :clearable="props.clearable">
    <el-option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.title"> </el-option>
  </el-select>
</template>
<script setup>
import { listApi } from '@/api/poi/type';

const typeList = ref([]);

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
const areaCode = defineModel("areaCode");
const typeId = defineModel("typeId");

watch(() => areaCode.value, (value) => {
  listApi({areaCode: value}).then((res) => {
    if (res.data.length === 0) {
      typeId.value = null;
    }
    typeList.value = res.data;
  });
})
</script>
