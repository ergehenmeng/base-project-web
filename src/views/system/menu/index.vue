<template>
  <div>
    <div class="menu-content-main">
      <el-container>
        <el-aside width="200px" class="left-menu">
          <el-container>
            <el-header height="15px">
              <el-button v-has-perm="'nhK0'" type="primary" :icon="Plus" @click="handleCreate" link>新增主菜单</el-button>
            </el-header>
            <el-main>
              <el-scrollbar height="730px">
                <el-tree :data="menuList" node-key="id" :props="defaultProps" @node-click="clickTree">
                  <template #default="{ node, data }">
                    <span class="custom-tree-node">
                      <span>{{ node.label }}</span>
                      <span v-if="node.data.pid === '0'">
                        <el-button v-has-perm="'uhK0'" type="primary" :icon="Edit" @click.stop="handleEdit(node.data)" link
                          title="编辑"></el-button>
                        <el-button v-has-perm="'NhK0'" type="danger" :icon="Delete" @click.stop="handleDelete(node.data.id)"
                          link title="删除"></el-button>
                      </span>
                    </span>
                  </template>
                </el-tree>
              </el-scrollbar>
            </el-main>
          </el-container>
        </el-aside>
        <el-main>
          <div class="right-content-top">
            <el-form :inline="true" label-width="80px">
              <el-form-item>
                <el-input v-model="queryParams.queryName" placeholder="菜单名称" clearable @keyup.enter="search" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
              </el-form-item>
              <el-form-item class="right-button" v-has-perm="'vgK0'">
                <el-button v-has-perm="'nhK0'" type="primary" :icon="Plus" @click="handleCreate">新增菜单</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670"
              show-overflow-tooltip>
              <el-table-column prop="title" label="菜单名称" width="120" />
              <el-table-column prop="icon" label="图标" :formatter="formatter" width="80">
                <template #default="scope">
                  <el-icon :size="18">
                    <component :is="scope.row.icon"></component>
                  </el-icon>
                </template>
              </el-table-column>
              <el-table-column prop="state" label="状态" :formatter="formatter"/>
              <el-table-column prop="path" label="路由地址" />
              <el-table-column prop="subPath" label="权限URL" />
              <el-table-column prop="grade" label="菜单级别" :formatter="formatter" width="100" />
              <el-table-column prop="sort" label="排序" width="70">
                <template #default="scope">
                  <el-input v-model="scope.row.sort" @blur="handleSort(scope.row)" maxlength="3"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" />
              <el-table-column prop="createTime" label="创建时间" width="180" />
              <el-table-column prop="updateTime" label="更新时间" width="180" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button v-has-perm="'uhK0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link
                    title="编辑">
                  </el-button>
                  <el-button v-has-perm="'NhK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row.id)" link
                    title="删除">
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize"
              :page-sizes="[10, 20, 50]" layout="->, total, sizes, prev, pager, next" :total="total"
              @change="getPage" />
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
  <MenuForm ref="formRef" @reload="loadData"></MenuForm>
</template>
<script setup>
import { listPageApi, deleteApi, listMenuApi, sortApi } from '@/api/system/menu';
import { onMounted, reactive, ref } from 'vue';
import { Edit, Delete, Plus } from '@element-plus/icons-vue';
import { confirmMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import MenuForm from './MenuForm.vue';

const defaultProps = {
  label: 'title',
  children: 'children'
}

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('YhK0');
const sortAuth = userStore.hasAuth('GhK0');

const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const menuList = ref([]);
const formRef = ref();

const queryParams = reactive({
  queryName: "",
  page: 1,
  pageSize: 10,
  pid: ''
})

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
}

const getMenuList = () => {
  if (selectAuth) {
    listMenuApi().then(res => {
      menuList.value = res.data
    });
  }
}

const search = () => {
  queryParams.page = 1;
  getPage()
}

onMounted(() => {
  loadData();
})

const loadData = () => {
  getMenuList();
  getPage()
}

const handleDelete = (id) => {
  confirmMsg("确定要删除该菜单吗?", () => {
    const data = { id };
    deleteApi(data).then(res => {
      ElMessage.success('菜单删除成功');
      getPage();
    })
  })
}


const handleEdit = (row) => {
  formRef.value.openDialog(row);
}

const formatter = (row, column, cellValue) => {
  if (column.property === "grade") {
    return cellValue === 1 ? "导航菜单" : "按钮菜单";
  } else if (column.property === "state") {
    return cellValue === true ? "启用" : "禁用";
  }
  return cellValue;
}

const clickTree = (node) => {
  queryParams.pid = node.id;
  getPage();
}

const handleSort = (row) => {
  if (!sortAuth) {
    return;
  }
  const data = {
    id: row.id,
    sortBy: row.sort
  }
  sortApi(data).then(res => {
    getPage();
  })
}

</script>

<style lang="scss" scoped>
.left-menu {
  border-right: 1px solid rgba(0, 0, 0, .2);
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
