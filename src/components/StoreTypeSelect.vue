<template>
  <el-select v-model="storeId" :disabled="props.disabled" :clearable="props.clearable" filterable>
    <el-option v-for="item in storeList" :key="item.id" :value="item.id" :label="item.title" :disabled="item.state === 2 || item.title === null">
      <span style="float: left">{{ item.title === null ? '未命名' : item.title }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.state === 0 ? '未上架' : item.state === 2 ? '强制下架' : '已上架' }}</span>
    </el-option>
  </el-select>
</template>
<script setup>
import { storeListApi } from '@/api/product/store';
import { scenicListApi } from '@/api/product/scenic';
import { homestayListApi } from '@/api/product/homestay';
import { venueListApi } from '@/api/product/venue';
import { travelListApi } from '@/api/product/travel';
import { restaurantListApi } from '@/api/product/restaurant';

const storeList = ref([]);

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  productType: {
    type: String,
    default: null
  }
});
const storeId = defineModel();

const loadingStore = (productType) => {
  switch (productType) {
    case 'ticket':
      scenicListApi().then((res) => {
        storeList.value = res.data;
      });
      break;
    case 'homestay':
      homestayListApi().then((res) => {
        storeList.value = res.data;
      });
      break;
    case 'venue':
      venueListApi().then((res) => {
        storeList.value = res.data;
      });
      break;
    case 'line':
      travelListApi().then((res) => {
        storeList.value = res.data;
      });
      break;
    case 'voucher':
      restaurantListApi().then((res) => {
        storeList.value = res.data;
      });
      break;
    case 'item':
      storeListApi().then((res) => {
        storeList.value = res.data;
      });
      break;
    default:
      break;
  }
}

watch(() => props.productType, (val) => {
  loadingStore(val);
})

onMounted(() => {
  loadingStore(props.productType);
});
</script>
