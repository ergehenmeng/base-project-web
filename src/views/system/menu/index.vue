<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="菜单名称" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="正常" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-select v-model="queryParams.grade" clearable>
            <el-option label="导航" :value="1" />
            <el-option label="按钮" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-select v-model="queryParams.displayState" clearable>
            <el-option label="商户菜单" :value="1" />
            <el-option label="系统菜单" :value="2" />
            <el-option label="通用菜单" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item class="right-button" v-has-perm="'KjK0'">
          <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table row-key="id" :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670"
        show-overflow-tooltip>
        <el-table-column prop="title" label="菜单名称" width="150" />
        <el-table-column prop="icon" label="图标" :formatter="formatter" width="80">
          <template #default="scope">
            <el-icon :size="18">
              <component :is="scope.row.icon"></component>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="80">
          <template #default="scope">
            <el-switch v-model="scope.row.state" inline-prompt :active-value="true" :inactive-value="false" active-text="启用" inactive-text="禁用"
             @change="updateState(scope.row)" :disabled="!stateAuth" style="--el-switch-off-color: #ff4949;"/>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="菜单类型" :formatter="formatter" width="100" />
        <el-table-column prop="displayState" label="菜单权限" :formatter="formatter" />
        <el-table-column prop="path" label="路由地址" />
        <el-table-column prop="subPath" label="权限URL" />
        <el-table-column prop="sort" label="排序" width="75">
          <template #default="scope">
            <el-input v-model="scope.row.sort" @change="handleSort(scope.row)" maxlength="3" :readonly="!sortAuth" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-has-perm="'KjK0'" v-show="scope.row.grade === 1"  type="primary" :icon="CirclePlus"
              @click="handleCreate(scope.row)" link title="新增">
            </el-button>
            <el-button v-has-perm="'uhK0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑">
            </el-button>
            <el-button v-has-perm="'NhK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row.id)" link
              title="删除">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <MenuForm ref="formRef" @reload="loadData"></MenuForm>
</template>
<script setup>
import { deleteApi, listMenuApi, sortApi, stateApi } from '@/api/system/menu';
import { onMounted, reactive, ref } from 'vue';
import { Edit, Delete, Plus, CirclePlus } from '@element-plus/icons-vue';
import {confirmMsg, successMsg} from '@/utils/message';
import useUserStore from '@/store/user';
import MenuForm from './MenuForm.vue';

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('YhK0');
const sortAuth = userStore.hasAuth('GhK0');
const stateAuth = userStore.hasAuth('AhK0');
const loading = ref(false);
const pageData = ref([]);
const formRef = ref();

const queryParams = reactive({
  queryName: "",
  page: 1,
  pageSize: 10,
  state: null,
  grade: null,
  displayState: null
})

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
}

const search = () => {
  queryParams.page = 1;
  getPage()
}

onMounted(() => {
  loadData();
})

const loadData = () => {
  getPage()
}

const handleDelete = (id) => {
  confirmMsg("确定要删除该菜单吗?", () => {
    const data = { id };
    deleteApi(data).then(() => {
      successMsg('菜单删除成功');
      getPage();
    })
  })
}

const handleCreate = (row) => {
  const pid = row?.id || "0";
  formRef.value.openDialog({ pid: pid });
}

const handleEdit = (row) => {
  formRef.value.openDialog(row);
}

const formatter = (row, column, cellValue) => {
  if (column.property === "grade") {
    return cellValue === 1 ? "导航菜单" : "按钮菜单";
  } else if (column.property === "state") {
    return cellValue === true ? "启用" : "禁用";
  } else if (column.property === "displayState") {
    if (cellValue === 1) {
      return "商户菜单";
    }
    return cellValue === 2 ? "系统菜单" : "通用菜单"
  }
  return cellValue;
}

const handleSort = (row) => {
  const data = {
    id: row.id,
    sortBy: row.sort
  }
  sortApi(data).then(() => {
    getPage();
  })
}

const updateState = (row) => {
  stateApi({id: row.id, state: row.state}).then(() => {
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
