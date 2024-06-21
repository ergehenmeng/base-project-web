<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="角色名称" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="roleName" label="角色名称" width="200" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作">
          <template #header>
            <span style="margin-right: 5px;">操作</span>
            <CreateButton v-has-perm="'KjK0'" title="新增角色" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'5jK0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"> </el-button>
            <el-button v-has-perm="'ZjK0'" type="primary" :icon="Connection" @click="handleAuth(scope.row)" link title="菜单授权"> </el-button>
            <el-button v-has-perm="'UjK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"> </el-button>
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
  <RoleForm ref="formRef" @reload="getPage"></RoleForm>
  <AuthForm ref="authRef" @reload="getPage"></AuthForm>
</template>
<script setup>
import { deleteApi, listPageApi } from '@/api/system/role';
import { onMounted, reactive, ref } from 'vue';
import { Connection, Delete, Edit, Plus } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import RoleForm from './RoleForm.vue';
import AuthForm from './AuthForm.vue';
import useUserStore from '@/store/user';
import CreateButton from '@/components/CreateButton.vue'

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('JjK0');
const loading = ref(false);
const total = ref(0);
const formRef = ref();
const authRef = ref();
const pageData = ref([]);

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

const handleAuth = (row) => {
  authRef.value.openDialog(row);
};

const handleDelete = (row) => {
  confirmMsg('确定要删除该角色吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('角色删除成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  formRef.value.openDialog({});
};
</script>
