<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="活动名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="活动名称" min-width="200" />
        <el-table-column prop="startTime" label="活动时间" width="280" :formatter="formatter" />
        <el-table-column prop="num" label="提前预告" width="100" :formatter="formatter"/>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" min-width="200">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'KEi0'" title="新增限时购活动" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'ZEi0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'5Ei0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'UEi0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
import { deleteApi, listPageApi } from '@/api/marketing/limit';
import { onMounted, reactive, ref } from 'vue';
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
const selectAuth = userStore.hasAuth('JEi0');
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

const formatter = (row, column, cellValue) => {
  if (column.property === "startTime") {
    return cellValue + '~' + row.endTime;
  } else {
    return h('span', { title: '提前' + cellValue + "小时进行活动预告" }, cellValue);
  }
};

const handleDelete = (row) => {
  confirmMsg('确定要删除该限时购活动吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('限时购活动删除成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  router.push('/marketing/limit/create');
};

const handleEdit = (row) => {
  router.push('/marketing/limit/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/marketing/limit/detail/' + row.id);
};
</script>
