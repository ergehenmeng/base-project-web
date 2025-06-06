<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="举报原因" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="举报类型">
          <el-select v-model="queryParams.reportType" clearable>
            <el-option label="淫秽色情" :value="1" />
            <el-option label="营销广告" :value="2" />
            <el-option label="违法信息" :value="3" />
            <el-option label="网络暴力" :value="4" />
            <el-option label="虚假谣言" :value="5" />
            <el-option label="养老诈骗" :value="6" />
            <el-option label="其他" :value="7" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="commentContent" label="原评论信息" />
        <el-table-column prop="nickName" label="举报人昵称" />
        <el-table-column prop="reportType" label="举报类型" :formatter="formatter" />
        <el-table-column prop="content" label="举报原因" />
        <el-table-column prop="createTime" label="举报时间" />
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
import { reportPageApi } from '@/api/operation/comment';
import useUserStore from '@/store/user';
import { useRoute } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('pBU0');
const otherAuth = userStore.hasAuth('VWU0');

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  objectType: null,
  commentId: null,
  reportType: null
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth || otherAuth) {
      const { data } = await reportPageApi(queryParams);
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
  const query = route.query;
  if (query.commentId) {
    queryParams.commentId = query.commentId;
  }
  getPage();
});

const formatter = (_row, _column, cellValue) => {
  switch (cellValue) {
    case 1:
      return '淫秽色情';
    case 2:
      return '营销广告';
    case 3:
      return '违法信息';
    case 4:
      return '网络暴力';
    case 5:
      return '虚假谣言';
    case 6:
      return '养老诈骗';
    case 7:
      return '其他';
    default:
      return '未知';
  }
};
</script>
