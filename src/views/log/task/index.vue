<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="类名、方法名、执行机器IP" clearable @keyup.enter="search" style="width: 300px" maxlength="30" />
        </el-form-item>
        <el-form-item label="执行结果">
          <el-select v-model="queryParams.state" clearable class="w100">
            <el-option label="成功" :value="true" />
            <el-option label="失败" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="beanName" label="类名" :formatter="formatter" min-width="200" />
        <el-table-column prop="methodName" label="方法名" min-width="150"/>
        <el-table-column prop="args" label="方法入参" min-width="150"/>
        <el-table-column prop="state" label="执行结果" :formatter="formatter" width="120"/>
        <el-table-column prop="startTime" label="执行时间" width="180"/>
        <el-table-column prop="elapsedTime" label="任务耗时(ms)" width="150"/>
        <el-table-column prop="ip" label="机器IP" width="150"/>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button v-has-perm="'eoa0'" v-show="!scope.row.state" :icon="Document" @click="handleDetail(scope.row.errorMsg)" link title="详情"></el-button>
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
  <ContentDialog ref="contentRef"></ContentDialog>
</template>
<script setup>
import { listPageApi } from '@/api/log/task';
import { Document } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import ContentDialog from '@/components/ContentDialog.vue';

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('foa0');
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const contentRef = ref();

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null
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

const handleDetail = (content) => {
  contentRef.value.openDialog(content);
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'state') {
    return cellValue ? '成功' : h('span', { style: 'color: red' }, '失败');
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
