<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="提现单号" clearable @keyup.enter="search" class="w250" maxlength="30" />
        </el-form-item>
        <el-form-item label="提现状态">
          <el-select v-model="queryParams.state" clearable class="w130">
            <el-option label="提现中" value="0" />
            <el-option label="提现成功" value="1" />
            <el-option label="提现失败" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="提现方式">
          <el-select v-model="queryParams.withdrawWay" clearable class="w120">
            <el-option label="手动提现" value="1" />
            <el-option label="自动提现" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <div class="w220">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="activityDate" class="w220"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'Atu0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading" title="最多导出10000条数据">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="merchantName" label="商户名称" />
        <el-table-column prop="state" label="提现状态" :formatter="formatter" />
        <el-table-column prop="withdrawWay" label="提现方式" :formatter="formatter" />
        <el-table-column prop="amount" label="提现金额" />
        <el-table-column prop="fee" label="提现手续费" />
        <el-table-column prop="refundNo" label="提现流水号" />
        <el-table-column prop="outRefundNo" label="第三方流水号" />
        <el-table-column prop="createTime" label="申请时间" />
        <el-table-column prop="paymentTime" label="到账时间" />
        <el-table-column prop="remark" label="备注信息" />
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
import { exportApi, listPageApi } from '@/api/merchant/withdraw';
import { Download } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import { downloadExcel } from '@/utils/common.js';
import { successMsg } from '@/utils/message.js';

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('Gtu0');
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const activityDate = ref([])
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  withdrawWay: null,
  startDate: null,
  endDate: null
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      if (activityDate.value.length === 2) {
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

const exportLoading = ref(false);

const handleExcel = () => {
  exportLoading.value = true;
  exportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '提现记录列表');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'state') {
    switch (cellValue) {
      case 0:
        return '提现中';
      case 1:
        return '提现成功';
      case 2:
        return '提现失败';
    }
  } else if (column.property === 'withdrawWay') {
    return cellValue === 1 ? '手动提现' : '自动提现';
  } else {
    return cellValue;
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
