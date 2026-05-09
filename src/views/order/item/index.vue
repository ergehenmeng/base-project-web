<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="订单编号、商品名称、手机号" clearable @keyup.enter="search" class="w220" maxlength="30" />
        </el-form-item>
        <el-form-item label="订单状态">
          <OrderStateSelect v-model="queryParams.state" class="w120" :exclude="[1, 2]"></OrderStateSelect>
        </el-form-item>
        <el-form-item label="退款状态">
          <RefundStateSelect v-model="queryParams.refundState" />
        </el-form-item>
        <el-form-item label="订单日期">
          <div class="w220">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="activityDate" class="w220"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="优惠券">
          <el-select v-model="queryParams.useVoucher" clearable class="w100">
            <el-option label="使用" :value="true" />
            <el-option label="不使用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="queryParams.orderType" clearable class="w120">
            <el-option label="普通" :value="0" />
            <el-option label="限时购" :value="1" />
            <el-option label="拼团" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'LRD0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading" title="最多导出10000条数据">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="650" show-overflow-tooltip>
        <el-table-column prop="orderNo" label="订单编号" width="200" />
        <el-table-column prop="title" label="商品名称" min-width="180" />
        <el-table-column prop="storeName" label="所属店铺" min-width="150" />
        <el-table-column prop="state" label="订单状态" width="85" :formatter="formatter" />
        <el-table-column prop="refundState" label="退款状态" width="100" :formatter="formatter" />
        <el-table-column prop="num" label="购买数量" width="80" />
        <el-table-column prop="mobile" label="订单联系人" width="115" />
        <el-table-column prop="payAmount" label="付款金额" width="90" />
        <el-table-column prop="discountAmount" label="优惠金额" width="80" />
        <el-table-column prop="createTime" label="下单时间" width="160" />
        <el-table-column prop="payTime" label="支付时间" width="160" />
        <el-table-column prop="payType" label="支付方式" width="100" :formatter="formatter" />
        <el-table-column prop="orderType" label="订单类型" width="80" />
        <el-table-column label="操作" fixed="right" width="60">
          <template #default="scope">
            <el-button v-has-perm="'mRD0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
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
  </div>
</template>
<script setup>
import { exportApi, listPageApi } from '@/api/order/item';
import { Document, Download } from '@element-plus/icons-vue';
import usePermStore from '@/store/perm';
import { useRoute, useRouter } from 'vue-router'
import { closeTypeFormat, downloadExcel, orderStateFormat, payTypeFormat, refundStateFormat } from '@/utils/common.js';
import OrderStateSelect from '@/components/OrderStateSelect.vue';
import { successMsg } from '@/utils/message.js';
import RefundStateSelect from '@/components/RefundStateSelect.vue';

const router = useRouter();
const route = useRoute();
const permStore = usePermStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const activityDate = ref([])
const selectAuth = permStore.hasAuth('2RD0');
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  refundState: null,
  useVoucher: null,
  orderType: null,
  startDate: null,
  endDate: null
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      if (activityDate.value?.length === 2) {
        queryParams.startDate = activityDate.value[0];
        queryParams.endDate = activityDate.value[1];
      } else {
        queryParams.startDate = null;
        queryParams.endDate = null;
      }
      const { data } = await listPageApi(queryParams);
      pageData.value = data.rows;
      total.value = data.total;
    }
  } finally {
    loading.value = false;
  }
};

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  const state = route.params.state;
  if (state) {
    queryParams.state = parseInt(state);
  }
  getPage();
});

const formatter = (_row, column, cellValue) => {
  if (column.property === 'state') {
    return orderStateFormat(cellValue);
  } else if (column.property === 'closeType') {
    return closeTypeFormat(cellValue);
  } else if (column.property === 'refundState') {
    return refundStateFormat(cellValue);
  } else if (column.property === 'payType') {
    return payTypeFormat(cellValue);
  } else {
    return cellValue;
  }
};

const exportLoading = ref(false);

const handleExcel = () => {
  exportLoading.value = true;
  exportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '零售订单列表');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const handleDetail = (row) => {
  router.push('/order/item/detail/' + row.orderNo);
};
</script>
