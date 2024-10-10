<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="IP地址、备注" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="startIp" label="IP段" :formatter="formatter" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="180">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'HoK0'" title="新增IP黑名单" @click="handleCreate"></CreateButton>
            <QuestionTip content="注意：黑名单那的变更不会立即生效，需刷新缓存才能生效" />
          </template>
          <template #default="scope">
            <el-button v-has-perm="'4oK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
  <BlackForm ref="formRef" @reload="getPage"></BlackForm>
</template>
<script setup>
import { deleteApi, listPageApi } from '@/api/system/black';
import { Delete } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import BlackForm from './BlackForm.vue';
import CreateButton from '@/components/CreateButton.vue';
import QuestionTip from '@/components/QuestionTip.vue'

const loading = ref(false);
const total = ref(0);
const formRef = ref();
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('boK0');
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10
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

const formatter = (row) => {
  return row.startIp + '~' + row.endIp;
};

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  getPage();
});

const handleDelete = (row) => {
  confirmMsg('确定要删除该IP段吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('IP段删除成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  formRef.value.openDialog();
};
</script>
