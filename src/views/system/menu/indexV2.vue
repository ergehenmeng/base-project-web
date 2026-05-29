<template>
  <div>
    <div class="main-content-menu">
      <el-container>
        <el-aside width="200px" class="left-menu">
          <el-scrollbar max-height="calc(100vh - 160px)">
            <div style="padding: 20px 20px 0 20px">
              <el-tree :data="menuList" node-key="id" :props="props" @node-click="clickTree" :highlight-current="true" :expand-on-click-node="false" current-node-key="0" :default-expanded-keys="['0']">
                <template #default="{ node }">
                  <span class="custom-tree-node">
                    <span>{{ node.label }}</span>
                  </span>
                </template>
              </el-tree>
            </div>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <div class="right-content-top">
            <el-form :inline="true" label-width="80px">
              <el-form-item>
                <el-input v-model="queryParams.queryName" placeholder="菜单名称、备注" clearable @keyup.enter="search" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
              </el-form-item>
              <el-form-item class="right-button" v-has-perm="'vgK0'">
                <el-button v-has-perm="'nhK0'" type="primary" @click="handleCreate">{{ buttonName }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="650" show-overflow-tooltip>
              <el-table-column prop="title" label="菜单名称" width="120" />
              <el-table-column prop="icon" label="图标" :formatter="formatter" width="80">
                <template #default="scope">
                  <el-icon :size="18">
                    <component :is="scope.row.icon" v-if="scope.row.icon"></component>
                  </el-icon>
                </template>
              </el-table-column>
              <el-table-column prop="code" label="编码" width="60" />
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
              <el-table-column prop="path" label="路由地址" />
              <el-table-column prop="subPath" label="权限URL" min-width="100"/>
              <el-table-column prop="sort" label="排序" width="75">
                <template #default="scope">
                  <el-input v-model="scope.row.sort" @change="handleSort(scope.row)" maxlength="3" :readonly="!sortAuth" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" />
              <el-table-column prop="updateTime" label="更新时间" width="170" />
              <el-table-column label="操作" width="80">
                <template #default="scope">
                  <el-button v-has-perm="'uhK0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"> </el-button>
                  <el-button v-has-perm="'NhK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row.id)" link title="删除"> </el-button>
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
        </el-main>
      </el-container>
    </div>
  </div>
  <MenuForm ref="formRef" @reload="loadData"></MenuForm>
</template>
<script setup>
import { listPageApi, deleteApi, sortApi, treeApi, stateApi } from '@/api/system/menu';
import { onMounted, reactive, ref } from 'vue';
import { Edit, Delete } from '@element-plus/icons-vue';
import { confirmMsg } from '@/utils/message';
import usePermStore from '@/store/perm';
import MenuForm from './MenuForm.vue';

const props = {
  label: 'title',
  children: 'children'
};

const permStore = usePermStore();
const selectAuth = permStore.hasAuth('YhK0');
const sortAuth = permStore.hasAuth('GhK0');
const stateAuth = permStore.hasAuth('AhK0');
const buttonName = ref('新增菜单');

const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const menuList = ref([]);
const formRef = ref();

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  pid: '0'
});

const updateState = (row) => {
  loading.value = true;
  stateApi({ id: row.id, state: row.state }).finally(() => {
    loading.value = false;
  });
};

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

const handleCreate = () => {
  formRef.value.openDialog({ pid: queryParams.pid });
};

const getTree = () => {
  if (selectAuth) {
    treeApi().then((res) => {
      menuList.value = [res.data];
    });
  }
};

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  loadData();
});

const loadData = () => {
  getTree();
  getPage();
};

const handleDelete = (id) => {
  confirmMsg('确定要删除该菜单吗?', () => {
    const data = { id };
    deleteApi(data).then(() => {
      ElMessage.success('菜单删除成功');
      getPage();
    });
  });
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

const clickTree = (node) => {
  if (node.id === '0') {
    buttonName.value = '添加菜单';
  } else {
    buttonName.value = `【${node.title}】下添加菜单`;
  }
  queryParams.pid = node.id;
  getPage();
};

const handleSort = (row) => {
  if (!sortAuth) {
    return;
  }
  const data = {
    id: row.id,
    sortBy: row.sort
  };
  sortApi(data).then(() => {
    getPage();
  });
};
</script>

<style lang="scss" scoped>
.left-menu {
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  height: calc(100vh - 155px);
}

.main-content-menu {
  background-color: #fff;
  padding: 20px 0;
  border-radius: 3px;
  max-height: calc(100vh - 120px);
}

.right-content-top {
  .right-button {
    float: right;
  }
  .el-input {
    width: 200px;
  }
  margin-bottom: 10px;
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
