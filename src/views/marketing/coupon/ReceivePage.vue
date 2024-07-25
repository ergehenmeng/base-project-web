<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="昵称、手机号、订单号" class="w250" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="未使用" :value="0" />
            <el-option label="已使用" :value="1" />
            <el-option label="已过期" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="nickName" label="昵称" min-width="120" />
        <el-table-column prop="mobile" label="手机号码" min-width="120" />
        <el-table-column prop="state" label="状态" min-width="100" :formatter="formatter" />
        <el-table-column prop="orderNo" label="优惠券所属订单号" min-width="180" />
        <el-table-column prop="receiveTime" label="领取时间" min-width="180" />
        <el-table-column prop="useTime" label="使用时间" min-width="180" />
      </el-table>
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="->, total, sizes, prev, pager, next"
        :total="total"
        @change="getPage"
      />
    </div>
  </div>
</template>
<script setup>
import { receivePageApi } from '@/api/marketing/coupon';
import useUserStore from '@/store/user';
import { useRoute } from 'vue-router';

const route = useRoute();
const loading = ref(false);
const total = ref(0);
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('CPi0');
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  couponId: null,
  state: null
});

const pageData = ref([]);

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await receivePageApi(queryParams);
      pageData.value = data.rows;
      total.value = data.total;
    }
  } finally {
    loading.value = false;
  }
};

const formatter = (row, column, cellValue) => {
  if (cellValue === 0) {
    return '未使用';
  }
  return cellValue === 1 ? '已使用' : '已过期';
};

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  queryParams.couponId = route.params.id;
  getPage();
});
</script>
