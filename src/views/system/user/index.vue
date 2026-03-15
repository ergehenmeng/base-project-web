<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="昵称、手机号" clearable @keyup.enter="search" maxlength="30" />
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
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="nickName" label="昵称" width="120" />
        <el-table-column prop="userName" label="账户名" width="150" />
        <el-table-column prop="mobile" label="手机号" width="150" />
        <el-table-column prop="state" label="状态" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.state" :active-value="1" :inactive-value="0" inline-prompt active-text="正常" inactive-text="锁定" disabled style="--el-switch-off-color: #ff4949" />
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="所属部门" width="150" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" width="220">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'gqK0'" title="新增用户" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'mqK0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'iqK0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'qqK0'" v-show="scope.row.state === 1" type="warning" :icon="Lock" @click="handleLock(scope.row)" link title="锁定"></el-button>
            <el-button v-has-perm="'8qK0'" v-show="scope.row.state === 0" type="success" :icon="Unlock" @click="handleUnlock(scope.row)" link title="解锁"></el-button>
            <el-button v-has-perm="'jqK0'" @click="handleReset(scope.row)" link title="重置密码">
              <ResetPwd></ResetPwd>
            </el-button>
            <el-button v-has-perm="'BqK0'" @click="handleUnbind(scope.row)" link title="解绑登录双因子校验">
              <Unbind />
            </el-button>
            <el-button v-has-perm="'2qK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
  </div>
  <UserForm ref="formRef" @reload="getPage"></UserForm>
</template>
<script setup>
import { deleteApi, listPageApi, lockApi, resetPwdApi, unbindTotpApi, unlockApi } from '@/api/system/user';
import { Delete, Document, Edit, Lock, Unlock } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import UserForm from './UserForm.vue';
import usePermStore from '@/store/perm';
import CreateButton from '@/components/CreateButton.vue';
import { renderMsg } from '@/utils/common.js';
import ResetPwd from '@/components/icon/ResetPwd.vue';
import Unbind from '@/components/icon/Unbind.vue';

const loading = ref(false);
const total = ref(0);
const formRef = ref();
const permStore = usePermStore();
const selectAuth = permStore.hasAuth('XqK0');
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

const handleDetail = (row) => {
  formRef.value.openDialog({ id: row.id, type: 'detail' });
};

const handleEdit = (row) => {
  formRef.value.openDialog({ id: row.id, type: 'edit' });
};

const handleLock = (row) => {
  const msg = renderMsg(['确定要', () => '锁定', '该用户吗?']);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    lockApi(data).then(() => {
      successMsg('用户锁定成功');
      getPage();
    });
  });
};

const handleUnlock = (row) => {
  const msg = renderMsg(['确定要', () => '解锁', '该用户吗?']);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    unlockApi(data).then(() => {
      successMsg('用户解锁成功');
      getPage();
    });
  });
};

const handleUnbind = (row) => {
  const msg = renderMsg(['确定要解绑', () => '登录双因子校验', '吗?']);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    unbindTotpApi(data).then(() => {
      successMsg('解绑成功');
    });
  });
};

const handleReset = (row) => {
  const msg = renderMsg(['确定要', () => '重置', '该用户的密码吗?']);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    resetPwdApi(data).then(() => {
      successMsg('密码重置成功');
      getPage();
    });
  });
};

const handleDelete = (row) => {
  const msg = renderMsg(['确定要', () => '删除', '该用户吗?']);
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
