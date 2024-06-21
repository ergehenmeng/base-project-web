<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="标签名称" clearable @keyup.enter="getPage" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="正常" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPage">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table row-key="id" :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="标签名称" />
        <el-table-column prop="icon" label="图标">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image fit="contain" :src="scope.row.icon" style="width: 50px; height: 50px" preview-teleported hide-on-click-modal />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" :formatter="formatter"> </el-table-column>
        <el-table-column prop="sort" label="排序" width="80">
          <template #default="scope">
            <el-input v-model="scope.row.sort" @change="handleSort(scope.row)" maxlength="3" :readonly="!sortAuth" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'7JR0'" title="新增标签" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'7JR0'" v-show="scope.row.id.length < 15" type="primary" :icon="CirclePlus" @click="handleCreate(scope.row)" link title="新增"></el-button>
            <el-button v-has-perm="'WJR0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'3JR0'" type="danger" :icon="Delete" @click="handleDelete(scope.row.id)" link title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <ItemTagForm ref="formRef" @reload="getPage"></ItemTagForm>
</template>
<script setup>
import { deleteApi, listApi, sortApi } from '@/api/config/itemTag';
import { onMounted, reactive, ref } from 'vue';
import { CirclePlus, Delete, Edit } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import ItemTagForm from './ItemTagForm.vue';
import CreateButton from '@/components/CreateButton.vue';

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('BJR0');
const sortAuth = userStore.hasAuth('LJR0');
const loading = ref(false);
const pageData = ref([]);
const formRef = ref();

const queryParams = reactive({
  queryName: '',
  state: null
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await listApi(queryParams);
      pageData.value = data;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getPage();
});

const handleDelete = (id) => {
  confirmMsg('确定要删除该标签吗?', () => {
    const data = { id };
    deleteApi(data).then(() => {
      successMsg('标签删除成功');
      getPage();
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

const handleSort = (row) => {
  const data = {
    id: row.id,
    sortBy: row.sort
  };
  sortApi(data).then(() => {
    getPage();
  });
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'state') {
    return cellValue
      ? h('span', { style: 'color: green;' }, '启用')
      : h(
          'span',
          {
            style: 'color: red;',
            title: '禁用后该标签及子标签将无法使用'
          },
          '禁用'
        );
  } else {
    return cellValue;
  }
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
