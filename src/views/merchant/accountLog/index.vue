<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="交易单号" clearable @keyup.enter="search" class="w250" maxlength="30" />
        </el-form-item>
        <el-form-item label="资金类型">
          <el-select v-model="queryParams.accountType" clearable class="w130">
            <el-option label="订单收入" value="1" />
            <el-option label="订单退款" value="2" />
            <el-option label="积分提现收入" value="3" />
            <el-option label="提现支出" value="4" />
            <el-option label="积分充值支出" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="收支类型">
          <el-select v-model="queryParams.direction" clearable style="width: 100px">
            <el-option label="收入" value="1" />
            <el-option label="支出" value="2" />
          </el-select>
        </el-form-item>
        <MerchantSelect v-model="queryParams.merchantId" label="商户名称"></MerchantSelect>
        <el-form-item label="订单日期">
          <div class="w220">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="activityDate" class="w220"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'PCu0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading" title="最多导出10000条数据">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="650" show-overflow-tooltip>
        <el-table-column prop="merchantName" label="商户名称" min-width="200"/>
        <el-table-column prop="accountType" label="资金变动类型" :formatter="formatter" min-width="150"/>
        <el-table-column prop="amount" label="变动金额" min-width="130"/>
        <el-table-column prop="direction" label="收支类型" :formatter="formatter" min-width="100"/>
        <el-table-column prop="surplusAmount" label="变动后余额" min-width="130"/>
        <el-table-column prop="tradeNo" label="交易单号" min-width="250" />
        <el-table-column prop="createTime" label="操作时间" min-width="170"/>
        <el-table-column prop="remark" label="备注信息" min-width="150"/>
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
import { exportApi, listPageApi } from '@/api/merchant/accountLog';
import { Download } from '@element-plus/icons-vue';
import usePermStore from '@/store/perm';
import { downloadExcel } from '@/utils/common.js';
import { successMsg } from '@/utils/message.js';
import MerchantSelect from '@/components/MerchantSelect.vue';

const permStore = usePermStore();
const selectAuth = permStore.hasAuth('sCu0');
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const activityDate = ref([])
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  accountType: null,
  merchantId: null,
  direction: null,
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
      downloadExcel(res, '资金变动记录');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'accountType') {
    switch (cellValue) {
      case 1:
        return '订单收入';
      case 2:
        return '订单退款';
      case 3:
        return '积分提现收入';
      case 4:
        return '提现支出';
      case 5:
        return '积分充值支出';
      default:
        return '未知';
    }
  } else if (column.property === 'direction') {
    return cellValue === 1 ? '收人' : '支出';
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
