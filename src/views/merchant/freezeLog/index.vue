<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="订单编号" clearable @keyup.enter="search" class="w250" maxlength="30" />
        </el-form-item>
        <el-form-item label="冻结状态">
          <el-select v-model="queryParams.state" clearable class="w100">
            <el-option label="冻结中" value="1" />
            <el-option label="已解冻" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更类型">
          <el-select v-model="queryParams.changeType" clearable class="w130">
            <el-option label="支付冻结" value="1" />
            <el-option label="退款解冻" value="2" />
            <el-option label="订单完成解冻" value="3" />
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
        <el-form-item v-has-perm="'wKu0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading" title="最多导出10000条数据">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="merchantName" label="商户名称" />
        <el-table-column prop="orderNo" label="订单编号" />
        <el-table-column prop="amount" label="冻结金额" />
        <el-table-column prop="state" label="状态" :formatter="formatter" />
        <el-table-column prop="changeType" label="变更类型" :formatter="formatter" />
        <el-table-column prop="createTime" label="冻结时间" />
        <el-table-column prop="unfreezeTime" label="解冻时间" />
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
import { exportApi, listPageApi } from '@/api/merchant/freezeLog';
import { Download } from '@element-plus/icons-vue';
import usePermStore from '@/store/perm';
import { downloadExcel } from '@/utils/common.js';
import { successMsg } from '@/utils/message.js';

const permStore = usePermStore();
const selectAuth = permStore.hasAuth('EKu0');
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const activityDate = ref([])
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  changeType: null,
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

const exportLoading = ref(false);

const handleExcel = () => {
  exportLoading.value = true;
  exportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '资金冻结记录');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'changeType') {
    switch (cellValue) {
      case 1:
        return '支付冻结';
      case 2:
        return '退款解冻';
      case 3:
        return '订单完成解冻';
    }
  } else if (column.property === 'state') {
    return cellValue === 1 ? '冻结中' : '已解冻';
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
