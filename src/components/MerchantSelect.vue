<template>
  <el-select v-model="merchantId" :clearable="props.clearable" filterable>
    <el-option v-for="item in merchantList" :key="item.id" :label="item.merchantName" :value="item.id" :disabled="props.disabled">
      <span style="float: left">{{ item.merchantName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">法人：{{ item.legalName }}</span>
    </el-option>
  </el-select>
</template>
<script setup>
import {listApi} from "@/api/system/merchant";

const merchantList = ref([]);

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  }
});
const merchantId = defineModel();

onMounted(() => {
  listApi().then(res => {
    merchantList.value = res.data;
  })
})

</script>
<style lang="scss" scoped>
</style>