<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="分类标题" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="分类标题" />
        <el-table-column prop="code" label="资讯编码" />
        <el-table-column prop="includeTitle" label="包含标题" :formatter="formatter" />
        <el-table-column prop="includeDepict" label="包含描述信息" :formatter="formatter" />
        <el-table-column prop="includeImage" label="包含图集" :formatter="formatter" />
        <el-table-column prop="includeContent" label="包含详细信息" :formatter="formatter" />
        <el-table-column prop="includeVideo" label="包含视频" :formatter="formatter" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'TcR0'" title="新增资讯配置" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'ocR0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'vcR0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
  <NewsForm ref="newsRef" @reload="getPage"></NewsForm>
</template>
<script setup>
import { deleteApi, listPageApi } from '@/api/config/news';
import { Delete, Edit } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import NewsForm from './NewsForm.vue';
import useUserStore from '@/store/user';
import CreateButton from '@/components/CreateButton.vue';

const userStore = useUserStore();

const loading = ref(false);
const total = ref(0);
const newsRef = ref();
const pageData = ref([]);
const selectAuth = userStore.hasAuth('LcR0');

const queryParams = reactive({
  queryName: '',
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
  newsRef.value.openDialog(row);
};

const handleDelete = (row) => {
  confirmMsg('确定要删除该资讯配置吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('资讯配置删除成功');
      getPage();
    });
  });
};

const formatter = (_row, _column, cellValue) => {
  return cellValue ? '是' : '否';
};

const handleCreate = () => {
  newsRef.value.openDialog({});
};
</script>
