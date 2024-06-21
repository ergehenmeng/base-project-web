<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="订单编号" clearable @keyup.enter="search" style="width: 250px;" maxlength="30"/>
        </el-form-item>
        <el-form-item label="冻结状态">
          <el-select v-model="queryParams.state" clearable style="width: 100px;">
            <el-option label="冻结中" value="1" />
            <el-option label="已解冻" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更类型">
          <el-select v-model="queryParams.changeType" clearable style="width: 130px;">
            <el-option label="支付冻结" value="1" />
            <el-option label="退款解冻" value="2" />
            <el-option label="订单完成解冻" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <div style="width: 220px">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="queryParams.activityDate" style="width: 220px"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'wKu0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="merchantName" label="商户名称" />
        <el-table-column prop="orderNo" label="订单编号" />
        <el-table-column prop="amount" label="冻结金额" />
        <el-table-column prop="state" label="状态" :formatter="formatter"/>
        <el-table-column prop="changeType" label="变更类型" :formatter="formatter"/>
        <el-table-column prop="createTime" label="冻结时间" />
        <el-table-column prop="unfreezeTime" label="解冻时间" />
        <el-table-column prop="remark" label="备注信息" />
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
import { exportApi, listPageApi } from '@/api/merchant/freezeLog';
import { onMounted, reactive, ref } from 'vue';
import { Download } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import { downloadExcel } from '@/utils/common.js';
import { successMsg } from '@/utils/message.js';

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('EKu0');
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  changeType: null,
  activityDate: []
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


const formatter = (row, column, cellValue) => {
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
