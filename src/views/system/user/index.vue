<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="昵称、手机号" clearable @keyup.enter="search" />
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
        <el-form-item class="right-button" v-has-perm="'gqK0'">
          <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="nickName" label="昵称" width="120" />
        <el-table-column prop="mobile" label="登录账号" width="150" />
        <el-table-column prop="userType" label="用户类型" width="100" :formatter="formatter" />
        <el-table-column prop="dataType" label="数据权限" width="150" :formatter="formatter" />
        <el-table-column prop="state" label="状态" width="100" :formatter="formatter" />
        <el-table-column prop="deptName" label="所属部门" width="150" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-has-perm="'mqK0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link
              title="详情">
            </el-button>
            <el-button v-has-perm="'iqK0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑">
            </el-button>
            <el-button v-has-perm="'qqK0'" v-if="scope.row.state === 1" type="warning" :icon="Lock"
              @click="handleLock(scope.row)" link title="锁定">
            </el-button>
            <el-button v-has-perm="'8qK0'" v-if="scope.row.state === 0" type="success" :icon="Unlock"
              @click="handleUnlock(scope.row)" link title="解锁">
            </el-button>
            <el-button v-has-perm="'jqK0'" type="primary" :icon="Refresh" @click="handleReset(scope.row)" link
              title="重置密码">
            </el-button>
            <el-button v-has-perm="'2qK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link
              title="删除">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50]" layout="->, total, sizes, prev, pager, next" :total="total" @change="getPage" />
    </div>
  </div>
  <UserForm ref="formRef" @reload="getPage"></UserForm>
</template>
<script setup>
import { listPageApi, deleteApi, lockApi, unlockApi, resetPwdApi } from '@/api/system/user';
import { onMounted, reactive, ref, h } from 'vue';
import { Document, Edit, Lock, Unlock, Delete, Plus, Refresh } from '@element-plus/icons-vue';
import {confirmMsg, successMsg} from '@/utils/message';
import UserForm from './UserForm.vue';
import useUserStore from '@/store/user';

const loading = ref(false)
const total = ref(0);
const formRef = ref();
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('XqK0');
const queryParams = reactive({
  queryName: "",
  page: 1,
  pageSize: 10,
  state: null
})

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
}

const formatter = (row, column, cellValue) => {
  if (column.property === "state") {
    return cellValue === 1 ? h('span', { style: 'color: green;' }, '正常') : h('span', { style: 'color: #ff3d3d;' }, '锁定');
  } else if (column.property === "userType") {
    if (cellValue === 1) {
      return "系统用户";
    }
    return cellValue === 2 ? "商户管理员" : "商户用户";
  } else if (column.property === "dataType") {
    if (cellValue === 1) {
      return "本人数据权限";
    } else if (cellValue === 2) {
      return "本部门数据权限";
    } else if (cellValue === 3) {
      return "本部门及子部门数据权限";
    } else if (cellValue === 4) {
      return "所有数据权限";
    } else {
      return "自定义数据权限";
    }
  } else {
    return cellValue;
  }
}

const search = () => {
  queryParams.page = 1;
  getPage()
}

onMounted(() => {
  getPage()
})

const handleDetail = (row) => {
  formRef.value.openDialog(row);
}

const handleEdit = (row) => {
  formRef.value.openDialog(row);
}

const handleLock = (row) => {
  confirmMsg("确定要锁定该用户吗?", () => {
    const data = { id: row.id };
    lockApi(data).then(() => {
      successMsg('用户锁定成功');
      getPage();
    })
  })
}

const handleUnlock = (row) => {
  confirmMsg("确定要解锁该用户吗?", () => {
    const data = { id: row.id };
    unlockApi(data).then(() => {
      successMsg('用户解锁成功');
      getPage();
    })
  })
}

const handleReset = (row) => {
  confirmMsg("确定要重置该用户的密码?", () => {
    const data = { id: row.id };
    resetPwdApi(data).then(() => {
      successMsg('密码重置成功');
      getPage();
    })
  })
}

const handleDelete = (row) => {
  confirmMsg("确定要删除该用户吗?", () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('用户删除成功');
      getPage();
    })
  })
}

const handleCreate = () => {
  formRef.value.openDialog({});
}

</script>

