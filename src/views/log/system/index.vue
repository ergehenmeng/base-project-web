<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="昵称、手机号、访问地址、访问IP" clearable @keyup.enter="search" style="width: 300px" maxlength="30" />
        </el-form-item>
        <el-form-item label="日期">
          <div class="w220">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="activityDate" class="w220"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="url" label="请求地址" width="250" />
        <el-table-column prop="request" label="请求参数" min-width="300" />
        <el-table-column prop="nickName" label="昵称" width="100" />
        <el-table-column prop="mobile" label="操作人手机号" width="150" />
        <el-table-column prop="ip" label="访问ip" width="120" />
        <el-table-column prop="businessTime" label="接口耗时(ms)" width="120" />
        <el-table-column prop="createTime" label="访问时间" width="180" />
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="scope">
            <el-button :icon="Document" @click="handleResponse(scope.row.response)" link title="响应信息"></el-button>
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
  <ContentDialog ref="contentRef" title="响应信息"></ContentDialog>
</template>
<script setup>
import { listPageApi } from '@/api/log/system';
import useUserStore from '@/store/user';
import ContentDialog from '@/components/ContentDialog.vue'
import { Document } from '@element-plus/icons-vue'

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('IH00');
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const contentRef = ref();

const handleResponse = (content) => {
  contentRef.value.openDialog(content);
};
const activityDate = ref([])
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
</script>
