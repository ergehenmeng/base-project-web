<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="关联单号" clearable @keyup.enter="search" class="w250" maxlength="30" />
        </el-form-item>
        <el-form-item label="变动类型">
          <el-select v-model="queryParams.chargeType" clearable class="w130">
            <el-option label="充值" value="1" />
            <el-option label="支付收入" value="2" />
            <el-option label="支付退款" value="3" />
            <el-option label="抽奖支出" value="4" />
            <el-option label="提现支出" value="5" />
            <el-option label="关注赠送" value="6" />
            <el-option label="提现失败" value="7" />
          </el-select>
        </el-form-item>
        <el-form-item label="收支类型">
          <el-select v-model="queryParams.direction" clearable style="width: 100px">
            <el-option label="收入" value="1" />
            <el-option label="支出" value="2" />
          </el-select>
        </el-form-item>
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
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="merchantName" label="商户名称" />
        <el-table-column prop="chargeType" label="变动类型" :formatter="formatter" />
        <el-table-column prop="score" label="变动积分" />
        <el-table-column prop="direction" label="收支类型" :formatter="formatter" />
        <el-table-column prop="surplusScore" label="变动后积分" />
        <el-table-column prop="tradeNo" label="关联单号" />
        <el-table-column prop="createTime" label="变动时间" />
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
import { exportApi, listPageApi } from '@/api/merchant/scoreLog';
import { Download } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import { downloadExcel } from '@/utils/common.js';
import { successMsg } from '@/utils/message.js';

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('sCu0');
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const activityDate = ref([])
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  chargeType: null,
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
      downloadExcel(res, '积分变动记录');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'chargeType') {
    switch (cellValue) {
      case 1:
        return '充值';
      case 2:
        return '支付收入';
      case 3:
        return '支付退款';
      case 4:
        return '抽奖支出';
      case 5:
        return '提现支出';
      case 6:
        return '关注赠送';
      case 7:
        return '提现失败';
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
