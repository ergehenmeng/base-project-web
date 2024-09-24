<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="参数名称、标示符、备注" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.locked" clearable>
            <el-option label="可编辑" value="false" />
            <el-option label="禁止编辑" value="true" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="title" label="参数名称" width="250" />
        <el-table-column prop="nid" label="标示符" width="250" />
        <el-table-column prop="content" label="配置信息" width="300" />
        <el-table-column prop="locked" label="状态" width="100" :formatter="(row) => row.locked ? '禁止编辑' : '可编辑'"/>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="updateTime" label="更新时间" width="180"/>
        <el-table-column width="100">
          <template #header>
            <span>操作</span><QuestionTip content="注意：系统参数变更不会立即生效，需刷新缓存才能生效"/>
          </template>
          <template #default="scope">
            <el-button type="primary" :icon="Edit" @click="handleEdit(scope.row)" link></el-button>
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
  <EditForm ref="formRef" @reload="getPage" />
</template>
<script setup>
import { listPageApi } from '@/api/system/config';
import { Edit } from '@element-plus/icons-vue';
import EditForm from './EditForm.vue';
import useUserStore from '@/store/user';
import QuestionTip from '@/components/QuestionTip.vue'

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('siK0');
const loading = ref(false);
const total = ref(0);
const formRef = ref();

onMounted(() => {
  getPage();
});

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  locked: null
});

const pageData = ref([]);

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

const handleEdit = (row) => {
  formRef.value.openDialog(row);
};
</script>
