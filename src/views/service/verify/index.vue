<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="订单编号" clearable @keyup.enter="search" maxlength="30" class="w220"/>
        </el-form-item>
        <el-form-item label="核销日期">
          <div class="w220">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="activityDate" class="w220"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'KK20'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading" title="最多导出10000条数据">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="650" show-overflow-tooltip>
        <el-table-column prop="orderNo" label="订单编号" min-width="180" />
        <el-table-column prop="merchantName" label="商户名称" min-width="200" />
        <el-table-column prop="title" label="商品名称" min-width="180" />
        <el-table-column prop="verifyName" label="核销人" min-width="150" />
        <el-table-column prop="num" label="核销数量" min-width="150" />
        <el-table-column prop="remark" label="核销备注" min-width="100" />
        <el-table-column prop="createTime" label="核销时间" min-width="180" />
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
import { listPageApi, exportApi } from '@/api/service/verify';
import { Download } from '@element-plus/icons-vue';
import usePermStore from '@/store/perm';
import { downloadExcel } from '@/utils/common.js';
import { successMsg } from '@/utils/message.js';

const permStore = usePermStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const activityDate = ref([])
const selectAuth = permStore.hasAuth('xK20');
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
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
  getPage();
});

const exportLoading = ref(false);

const handleExcel = () => {
  exportLoading.value = true;
  exportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '核销列表');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

</script>
