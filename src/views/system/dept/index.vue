<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="部门名称" clearable @keyup.enter="getPage" maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPage">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table row-key="code" :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="700" show-overflow-tooltip>
        <el-table-column prop="title" label="部门名称" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'kLK0'" title="新增部门" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'kLK0'" v-show="scope.row.code.length < 15" type="primary" :icon="CirclePlus" @click="handleCreate(scope.row)" link title="新增"></el-button>
            <el-button v-has-perm="'lLK0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'OLK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row.id)" link title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <DeptForm ref="formRef" @reload="getPage"></DeptForm>
</template>
<script setup>
import { deleteApi, listApi } from '@/api/system/dept';
import { CirclePlus, Delete, Edit } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import usePermStore from '@/store/perm';
import CreateButton from '@/components/CreateButton.vue';
import DeptForm from '@/views/system/dept/DeptForm.vue'
import { renderMsg } from '@/utils/common.js'

const permStore = usePermStore();
const selectAuth = permStore.hasAuth('ULK0');
const loading = ref(false);
const pageData = ref([]);
const formRef = ref();

const queryParams = reactive({
  queryName: null
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
  const msg = renderMsg(["确定要", () => "删除", "该部门吗?"]);
  confirmMsg(msg, () => {
    const data = { id };
    deleteApi(data).then(() => {
      successMsg('部门删除成功');
      getPage();
    });
  });
};

const handleCreate = (row) => {
  const parentCode = row?.code || '0';
  formRef.value.openDialog({ parentCode });
};

const handleEdit = (row) => {
  formRef.value.openDialog(row);
};

</script>

