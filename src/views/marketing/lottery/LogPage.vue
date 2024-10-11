<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="昵称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="中奖状态">
          <el-select v-model="queryParams.winning" clearable>
            <el-option label="未中奖" :value="false" />
            <el-option label="已中奖" :value="true" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image fit="cover"
                        :src="scope.row.avatar?.split(',')[0]"
                        :preview-src-list="scope.row.avatar?.split(',')"
                        style="width: 30px; height: 30px"
                        preview-teleported
                        hide-on-click-modal/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" min-width="200" />
        <el-table-column prop="winning" label="是否中奖" width="300" :formatter="formatter" />
        <el-table-column prop="prizeTitle" label="奖品名称" width="150" />
        <el-table-column prop="winNum" label="中奖数量" width="150" />
        <el-table-column prop="createTime" label="抽奖时间" width="180" />
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
import useUserStore from '@/store/user';
import { useRoute } from 'vue-router';
import { logPageApi } from '@/api/marketing/lottery/index.js';

const route = useRoute();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('H1i0');
const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  winning: null,
  lotteryId: ''
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await logPageApi(queryParams);
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
  queryParams.lotteryId = route.params.id;
  getPage();
});

const formatter = (_row, _column, cellValue) => {
  return cellValue ? '已中奖' : '未中奖';
};
</script>
