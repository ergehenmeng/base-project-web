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
const storeMap = new Map();

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
    case 'ticket': {
      let list = storeMap.get('ticket');
      if (list) {
        storeList.value = list;
        return;
      }
      scenicListApi().then((res) => {
        storeList.value = res.data;
        storeMap.set('ticket', res.data);
      });
      break;
    }
    case 'homestay': {
      let list = storeMap.get('homestay');
      if (list) {
        storeList.value = list;
        return;
      }
      homestayListApi().then((res) => {
        storeList.value = res.data;
        storeMap.set('homestay', res.data);
      });
      break;
    }
    case 'venue': {
      let list = storeMap.get('venue');
      if (list) {
        storeList.value = list;
        return;
      }
      venueListApi().then((res) => {
        storeList.value = res.data;
        storeMap.set('venue', res.data);
      });
      break;
    }
    case 'line': {
      let list = storeMap.get('line');
      if (list) {
        storeList.value = list;
        return;
      }
      travelListApi().then((res) => {
        storeList.value = res.data;
        storeMap.set('line', res.data);
      });
      break;
    }
    case 'voucher': {
      let list = storeMap.get('voucher');
      if (list) {
        storeList.value = list;
        return;
      }
      restaurantListApi().then((res) => {
        storeList.value = res.data;
        storeMap.set('voucher', res.data);
      });
      break;
    }
    case 'item': {
      let list = storeMap.get('item');
      if (list) {
        storeList.value = list;
        return;
      }
      storeListApi().then((res) => {
        storeList.value = res.data;
        storeMap.set('item', res.data);
      });
      break;
    }
    default:
      break;
  }
};

watch(
  () => props.productType,
  (val) => {
    loadingStore(val);
  }
);

onMounted(() => {
  loadingStore(props.productType);
});
</script>
