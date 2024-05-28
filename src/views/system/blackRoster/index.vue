<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="IP地址、备注" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'HoK0'">
          <el-button type="primary" :icon="Refresh" @click="handleReload">刷新黑名单</el-button>
        </el-form-item>
        <el-form-item class="right-button" v-has-perm="'HoK0'">
          <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="startIp" label="IP段" :formatter="formatter" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-has-perm="'4oK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link
                       title="删除">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize"
                     :page-sizes="[10, 20, 50]" layout="->, total, sizes, prev, pager, next" :total="total" @change="getPage" />
    </div>
  </div>
  <BlackForm ref="formRef" @reload="getPage"></BlackForm>
</template>
<script setup>
import { listPageApi, deleteApi, reloadApi } from '@/api/system/black';
import { onMounted, reactive, ref } from 'vue';
import { Delete, Plus, Refresh } from '@element-plus/icons-vue';
import { confirmMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import BlackForm from './BlackForm.vue'

const loading = ref(false)
const total = ref(0);
const formRef = ref();
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('boK0');
const queryParams = reactive({
  queryName: "",
  page: 1,
  pageSize: 10
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

const formatter = (row) => {
  return row.startIp + "~" + row.endIp;
}

const search = () => {
  queryParams.page = 1;
  getPage()
}

onMounted(() => {
  getPage()
})

const handleDelete = (row) => {
  confirmMsg("确定要删除该IP段吗?", () => {
    const data = { id: row.id };
    deleteApi(data).then(res => {
      ElMessage.success('IP段删除成功');
      getPage();
    })
  })
}

const handleReload = () => {
  reloadApi().then(() => {
    ElMessage.success('黑名单刷新成功');
    getPage();
  })}

const handleCreate = () => {
  formRef.value.openDialog();
}

</script>

