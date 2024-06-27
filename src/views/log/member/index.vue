<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="昵称、设备序列号、访问地址、访问IP" clearable @keyup.enter="search" style="width: 300px" maxlength="50" />
        </el-form-item>
        <el-form-item label="访问渠道">
          <el-select v-model="queryParams.channel" clearable style="width: 120px">
            <el-option label="PC" value="PC" />
            <el-option label="ANDROID" value="ANDROID" />
            <el-option label="IOS" value="IOS" />
            <el-option label="H5" value="H5" />
            <el-option label="WECHAT" value="WECHAT" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="nickName" label="用户昵称" />
        <el-table-column prop="url" label="访问链接" width="250" />
        <el-table-column prop="ip" label="访问ip" width="120" />
        <el-table-column prop="elapsedTime" label="耗时(ms)" width="100" />
        <el-table-column prop="channel" label="访问渠道" width="100" />
        <el-table-column prop="requestParam" label="请求参数" width="250" />
        <el-table-column prop="createTime" label="请求时间" width="180" />
        <el-table-column prop="version" label="软件版本号" width="120" />
        <el-table-column prop="osVersion" label="平台版本号" width="120" />
        <el-table-column prop="deviceBrand" label="设备厂商" />
        <el-table-column prop="deviceModel" label="设备型号" />
        <el-table-column prop="serialNumber" label="设备唯一编号" width="120" />
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button v-has-perm="'eoa0'" v-show="scope.row.errorMsg" :icon="Document" @click="handleDetail(scope.row.errorMsg)" link title="详情"></el-button>
          </template>
        </el-table-column>
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
  <ContentDialog ref="contentRef"></ContentDialog>
</template>
<script setup>
import { listPageApi } from '@/api/log/member';
import { onMounted, reactive, ref } from 'vue';
import useUserStore from '@/store/user';
import { Document } from '@element-plus/icons-vue';
import ContentDialog from '@/components/ContentDialog.vue';

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('qva0');
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const contentRef = ref();

const handleDetail = (content) => {
  contentRef.value.openDialog(content);
};

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  channel: null
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
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
