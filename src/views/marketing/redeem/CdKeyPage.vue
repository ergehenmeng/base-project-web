<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="cdKey名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="待使用" :value="0" />
            <el-option label="已使用" :value="1" />
            <el-option label="已过期" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'dCi0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="cdKey" label="cdKey" min-width="200" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="createTime" label="生成时间" width="180" />
        <el-table-column prop="nickName" label="用户昵称" min-width="200" />
        <el-table-column prop="mobile" label="手机号" min-width="200" />
        <el-table-column prop="useTime" label="使用时间" width="180" />
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
import { grantExportApi, grantPageApi } from '@/api/marketing/redeem';
import useUserStore from '@/store/user';
import { useRouter, useRoute } from 'vue-router';
import { Download } from '@element-plus/icons-vue';
import { downloadExcel } from '@/utils/common.js';
import { successMsg } from '@/utils/message.js';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('0Ci0');
const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  redeemCodeId: '',
  state: null
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await grantPageApi(queryParams);
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
  grantExportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '兑换码列表');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  queryParams.redeemCodeId = route.params.id;
  getPage();
});

const formatter = (_row, _column, cellValue) => {
  if (cellValue === 0) {
    return '待使用';
  } else if (cellValue === 1) {
    return '已使用';
  } else if (cellValue === 2) {
    return '已过期';
  }
};
</script>
