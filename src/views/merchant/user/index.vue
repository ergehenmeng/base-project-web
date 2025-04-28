<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="用户昵称、手机号" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="正常" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="nickName" label="用户昵称" width="120" />
        <el-table-column prop="mobile" label="手机号" width="150" />
        <el-table-column prop="state" label="状态" width="100" :formatter="formatter" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" width="250">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'dsu0'" title="新增商户用户" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'psu0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'hsu0'" v-show="scope.row.state === 1" type="warning" :icon="Lock" @click="handleLock(scope.row)" link title="锁定"></el-button>
            <el-button v-has-perm="'Xsu0'" v-show="scope.row.state === 0" type="success" :icon="Unlock" @click="handleUnlock(scope.row)" link title="解锁"></el-button>
            <el-button v-has-perm="'isu0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
  <UserForm ref="formRef" @reload="getPage"></UserForm>
</template>
<script setup>
import { deleteApi, listPageApi, lockApi, unlockApi } from '@/api/merchant/user';
import { Delete, Edit, Lock, Unlock } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import UserForm from './UserForm.vue';
import useUserStore from '@/store/user';
import CreateButton from '@/components/CreateButton.vue';
import { renderMsg } from '@/utils/common.js'

const loading = ref(false);
const total = ref(0);
const formRef = ref();
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('0su0');
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null
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

const formatter = (_row, column, cellValue) => {
  if (column.property === 'state') {
    return cellValue === 1 ? h('span', { style: 'color: green;' }, '正常') : h('span', { style: 'color: #ff6b81;' }, '锁定');
  } else {
    return cellValue;
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

const handleLock = (row) => {
  const msg = renderMsg(["确定要", () => "锁定", "该用户吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    lockApi(data).then(() => {
      successMsg('用户锁定成功');
      getPage();
    });
  });
};

const handleUnlock = (row) => {
  const msg = renderMsg(["确定要", () => "解锁", "该用户吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    unlockApi(data).then(() => {
      successMsg('用户解锁成功');
      getPage();
    });
  });
};

const handleDelete = (row) => {
  const msg = renderMsg(["确定要", () => "删除", "该用户吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('用户删除成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  formRef.value.openDialog({});
};
</script>
