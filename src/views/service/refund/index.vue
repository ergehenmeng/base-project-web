<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="订单编号" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="核销日期">
          <div class="w220">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="queryParams.activityDate" class="w220"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="title" label="商品名称" width="250" />
        <el-table-column prop="orderNo" label="订单编号" width="200" />
        <el-table-column prop="state" label="退款状态" width="120" />
        <el-table-column prop="auditState" label="审核状态" width="120" />
        <el-table-column prop="num" label="退款数量" width="100" />
        <el-table-column prop="refundAmount" width="150" >
          <template #header>
            <span>申请退款金额<QuestionTip content="注意：含快递费"></QuestionTip></span>
          </template>
        </el-table-column>
        <el-table-column prop="expressFee" label="退款快递费" width="120" />
        <el-table-column prop="reason" label="退款原因" min-width="100" />
        <el-table-column prop="applyTime" label="申请时间" width="180" />
        <el-table-column prop="auditTime" label="审核时间" width="180" />
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
import { listPageApi } from '@/api/service/refund';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import { downloadExcel } from '@/utils/common.js';
import { successMsg } from '@/utils/message.js';
import QuestionTip from '@/components/QuestionTip.vue'

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('xK20');
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  activityDate: [],
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      if (queryParams.activityDate.length === 2) {
        queryParams.startDate = queryParams.activityDate[0];
        queryParams.endDate = queryParams.activityDate[1];
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
  getPage();
});


</script>
