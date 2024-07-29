<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="活动名称、商品名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="发放状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="未开始" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="已结束" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="活动名称" min-width="200" />
        <el-table-column prop="itemName" label="商品名称" min-width="200" />
        <el-table-column prop="startTime" label="活动时间" width="280" :formatter="formatter" />
        <el-table-column prop="num" label="拼团人数" width="100" />
        <el-table-column prop="expireTime" label="拼团有效期(分钟)" width="150" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'ifi0'" title="新增拼团活动" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'qfi0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'qfi0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'jfi0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
</template>
<script setup>
import { deleteApi, listPageApi } from '@/api/marketing/group';
import { Delete, Document, Edit } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import CreateButton from '@/components/CreateButton.vue';
import { confirmMsg, successMsg } from '@/utils/message.js';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('Xfi0');
const queryParams = reactive({
  queryName: null,
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

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  getPage();
});

const formatter = (row, _column, cellValue) => {
  return cellValue + '~' + row.endTime;
};

const handleDelete = (row) => {
  confirmMsg('确定要删除该拼团活动吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('拼团活动删除成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  router.push('/marketing/group/create');
};

const handleEdit = (row) => {
  router.push('/marketing/group/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/marketing/group/detail/' + row.id);
};
</script>
