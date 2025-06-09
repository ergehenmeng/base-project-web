<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="菜单名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table row-key="id" :data="pageData" style="width: 100%" lazy :load="loadTree" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" stripe v-loading="loading" max-height="700" show-overflow-tooltip>
        <el-table-column prop="title" label="菜单名称" width="150" />
        <el-table-column prop="icon" label="图标" width="80">
          <template #default="scope">
            <el-icon :size="18">
              <component :is="scope.row.icon" v-if="scope.row.icon"></component>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="编码" width="70"/>
        <el-table-column prop="state" label="状态" width="80">
          <template #default="scope">
            <el-switch
              v-model="scope.row.state"
              inline-prompt
              :active-value="true"
              :inactive-value="false"
              active-text="启用"
              inactive-text="禁用"
              @change="updateState(scope.row)"
              :disabled="!stateAuth"
              style="--el-switch-off-color: #ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="菜单类型" :formatter="formatter" width="100" />
        <el-table-column prop="displayState" label="菜单权限" :formatter="formatter" width="100" />
        <el-table-column prop="path" label="路由地址" width="160"/>
        <el-table-column prop="subPath" label="权限URL" />
        <el-table-column prop="sort" label="排序" width="75">
          <template #default="scope">
            <el-input v-model="scope.row.sort" @change="handleSort(scope.row)" maxlength="3" :readonly="!sortAuth" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"  width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        <el-table-column label="操作" width="180">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'KjK0'" title="新增菜单" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'KjK0'" v-show="scope.row.grade === 1" type="primary" :icon="CirclePlus" @click="handleCreate(scope.row)" link title="新增"></el-button>
            <el-button v-has-perm="'uhK0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'NhK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row.id)" link title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <MenuForm ref="formRef" @reload="search"></MenuForm>
</template>
<script setup>
import { deleteApi, listMenuApi, sortApi, stateApi } from '@/api/system/menu';
import { CirclePlus, Delete, Edit } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import MenuForm from './MenuForm.vue';
import CreateButton from '@/components/CreateButton.vue';
import { renderMsg } from '@/utils/common.js'

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('YhK0');
const sortAuth = userStore.hasAuth('GhK0');
const stateAuth = userStore.hasAuth('AhK0');
const loading = ref(false);
const pageData = ref([]);
const formRef = ref();

const queryParams = reactive({
  queryName: '',
  state: null,
  grade: null,
  pid: '0'
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await listMenuApi(queryParams);
      pageData.value = data;
    }
  } finally {
    loading.value = false;
  }
};

const search = () => {
  queryParams.pid = '0';
  getPage();
};

onMounted(() => {
  search();
});

const loadTree = async (row, _treeNode, resolve) => {
  queryParams.pid = row.id
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await listMenuApi(queryParams);
      resolve(data);
    }
  } finally {
    loading.value = false;
  }
};

const handleDelete = (id) => {
  const msg = renderMsg(["确定要", () => "删除", "该菜单吗?"]);
  confirmMsg(msg, () => {
    const data = { id };
    deleteApi(data).then(() => {
      successMsg('菜单删除成功');
      search();
    });
  });
};

const handleCreate = (row) => {
  const pid = row?.id || '0';
  formRef.value.openDialog({ pid: pid });
};

const handleEdit = (row) => {
  formRef.value.openDialog(row);
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'grade') {
    return cellValue === 1 ? '导航菜单' : '按钮菜单';
  } else if (column.property === 'state') {
    return cellValue === true ? '启用' : '禁用';
  } else if (column.property === 'displayState') {
    if (cellValue === 1) {
      return '商户菜单';
    }
    return cellValue === 2 ? '系统菜单' : '通用菜单';
  }
  return cellValue;
};

const handleSort = (row) => {
  const data = {
    id: row.id,
    sortBy: row.sort
  };
  sortApi(data).then(() => {
    search();
  });
};

const updateState = (row) => {
  stateApi({ id: row.id, state: row.state });
};
</script>

<style lang="scss" scoped>
.left-menu {
  border-right: 1px solid rgba(0, 0, 0, 0.2);
}

.menu-content-main {
  background-color: #fff;
  padding: 20px 0;
  border-radius: 3px;
  min-height: calc(100vh - 120px);
}

.right-content-top {
  .right-button {
    float: right;
  }

  .el-input,
  .el-select {
    width: 200px;
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
