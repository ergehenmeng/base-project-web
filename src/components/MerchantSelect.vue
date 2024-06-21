<template>
  <el-form-item :label="props.label" :prop="props.prop" v-show="show">
    <el-select v-model="merchantId" :clearable="props.clearable" filterable :style="`width: ${props.width}px;`" @change="handleChange">
      <el-option v-for="item in merchantList" :key="item.id" :label="item.merchantName" :value="item.id" :disabled="props.disabled" :title="item.merchantName">
        <span style="float: left">{{ item.merchantName }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">法人：{{ item.legalName }}</span>
      </el-option>
    </el-select>
  </el-form-item>
</template>
<script setup>
import { listApi } from '@/api/system/merchant';
import useUserStore from '@/store/user.js'

const userStore = useUserStore();
const merchantList = ref([]);
const show = userStore.user?.userType === 1;

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  prop: {
    type: String
  },
  label: {
    type: String,
    default: "所属商户"
  },
  width: {
    type: String,
    default: "250"
  }
});
const merchantId = defineModel();

const emits = defineEmits(['change'])

const handleChange = (value) => {
  emits("change", value);
}

onMounted(() => {
  if (show) {
    listApi().then((res) => {
      merchantList.value = res.data;
    });
  }
});
</script>
<style lang="scss" scoped></style>