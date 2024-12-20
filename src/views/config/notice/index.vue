<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="消息标题、消息内容" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="title" label="消息标题" width="180" />
        <el-table-column prop="code" label="消息编号" width="150" />
        <el-table-column prop="content" label="模板内容" min-width="250" />
        <el-table-column prop="remark" label="备注信息" />
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        <el-table-column label="操作" fixed="right" width="100">
          <template #header>
            <span>操作<QuestionTip content="注意：站内信模板的变更不会立即生效，需刷新缓存才能生效"/></span>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'D5R0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
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
  <NoticeForm ref="formRef" @reload="getPage"></NoticeForm>
</template>
<script setup>
import { listPageApi } from '@/api/config/notice';
import { Edit } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import NoticeForm from './NoticeForm.vue';
import QuestionTip from '@/components/QuestionTip.vue'

const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const formRef = ref();
const selectAuth = userStore.hasAuth('c5R0');

const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10
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

const handleEdit = (row) => {
  formRef.value.openDialog(row);
};
</script>
