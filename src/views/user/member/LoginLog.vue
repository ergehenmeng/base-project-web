<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="登录渠道" style="margin-left: 30px">
          <el-select v-model="queryParams.channel" clearable style="width: 120px">
            <el-option label="PC" value="PC" />
            <el-option label="ANDROID" value="ANDROID" />
            <el-option label="IOS" value="IOS" />
            <el-option label="H5" value="H5" />
            <el-option label="WECHAT" value="WECHAT" />
          </el-select>
        </el-form-item>
        <el-form-item label="登录日期">
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
      <el-table :data="pageData" style="width: 100%" v-loading="loading" max-height="650" show-overflow-tooltip>
        <el-table-column prop="channel" label="登陆渠道" min-width="100" />
        <el-table-column prop="ip" label="登陆ip" min-width="120" />
        <el-table-column prop="deviceBrand" label="设备厂商" min-width="120" />
        <el-table-column prop="deviceModel" label="设备型号" min-width="150" />
        <el-table-column prop="softwareVersion" label="软件版本" min-width="150" />
        <el-table-column prop="serialNumber" label="设备序列号" min-width="180" />
        <el-table-column prop="createTime" label="登录时间" min-width="180" />
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
import { loginPageApi } from '@/api/user/member';
import usePermStore from '@/store/perm';
import { useRoute } from 'vue-router';

const route = useRoute();
const loading = ref(false);
const total = ref(0);
const permStore = usePermStore();
const selectAuth = permStore.hasAuth('YNp0');
const pageData = ref([]);
const activityDate = ref([])
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  memberId: '',
  channel: null,
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
      const { data } = await loginPageApi(queryParams);
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
  queryParams.memberId = route.params.id;
  getPage();
});
</script>
