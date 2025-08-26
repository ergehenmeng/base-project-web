<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="单位名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="签名方式">
          <el-select v-model="queryParams.signType" clearable>
            <el-option label="MD5" value="MD5" />
            <el-option label="RSA" value="RSA" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="单位名称" min-width="200" />
        <el-table-column prop="signType" label="签名方式" width="80" />
        <el-table-column prop="appKey" label="appKey" width="300" />
        <el-table-column prop="email" label="邮箱" width="180"/>
        <el-table-column prop="expireDate" label="过期时间" width="100" />
        <el-table-column prop="remark" label="备注" width="180" />
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        <el-table-column label="操作" width="180">
          <template #header>
            <span>操作<QuestionTip content="注意：授权信息增删改不会立即生效，需刷新缓存才能生效" /></span>
            <CreateButton v-has-perm="'avK0'" title="新增授权信息" @click="handleCreate"/>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'0vK0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑" style="text-align: center"></el-button>
            <el-button v-has-perm="'pvK0'" type="primary" :icon="Refresh" @click="handleReset(scope.row)" link title="重置secret"></el-button>
            <el-button v-has-perm="'hvK0'" type="warning" :icon="Promotion" @click="sendEmail(scope.row)" link title="发送邮件"></el-button>
            <el-button v-has-perm="'dvK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
  <AuthForm ref="formRef" @reload="getPage"></AuthForm>
</template>
<script setup>
import { deleteApi, listPageApi, resetApi, sendEmailApi } from '@/api/system/auth'
import { Delete, Edit, Promotion, Refresh } from '@element-plus/icons-vue'
import { confirmMsg, successMsg } from '@/utils/message';
import AuthForm from './AuthForm.vue';
import useUserStore from '@/store/user';
import CreateButton from '@/components/CreateButton.vue';
import QuestionTip from '@/components/QuestionTip.vue'
import { renderMsg } from '@/utils/common.js'

const loading = ref(false);
const total = ref(0);
const formRef = ref();
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('9vK0');

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  signType: null
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

const handleDelete = (row) => {
  const msg = renderMsg(["确定要", () => "删除", "该授权信息吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('授权信息删除成功');
      getPage();
    });
  });
};

const handleReset = (row) => {
  const msg = renderMsg(["确定要", () => "重置", "secret信息吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    resetApi(data).then(() => {
      successMsg('secret信息重置成功');
    });
  });
};

const sendEmail = (row) => {
  const msg = renderMsg(["确定要给", () => row.email, "发送授权信息吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    sendEmailApi(data).then(() => {
      successMsg('邮件发送成功');
    })
  })
}

const handleCreate = () => {
  formRef.value.openDialog({});
};
</script>