<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="cdKey名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="待发放" :value="0" />
            <el-option label="已发放" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="title" label="cdKey名称" min-width="150" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="startTime" label="有效时间" width="300" :formatter="formatter" />
        <el-table-column prop="num" label="发放数量" width="100" />
        <el-table-column prop="amount" label="面额" width="100" />
        <el-table-column prop="remark" label="备注信息" width="150" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="210">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'ACi0'" title="新增兑换码" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'rCi0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'9Ci0'" v-show="scope.row.state === 0" type="success" :icon="Position" @click="handleGenerate(scope.row)" link title="生成cdKey"></el-button>
            <el-button v-has-perm="'0Ci0'" v-show="scope.row.state === 1" type="primary" :icon="Memo" @click="handleCdKeyPage(scope.row)" link title="兑换码列表"></el-button>
            <el-button v-has-perm="'aCi0'" v-show="scope.row.state === 0" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
  <RedeemForm ref="formRef" @reload="getPage"></RedeemForm>
</template>
<script setup>
import { deleteApi, generateApi, listPageApi } from '@/api/marketing/redeem';
import { Delete, Edit, Memo, Position } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import CreateButton from '@/components/CreateButton.vue';
import { confirmMsg, successMsg } from '@/utils/message.js';
import RedeemForm from '@/views/marketing/redeem/RedeemForm.vue';
import { renderMsg } from '@/utils/common.js'

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('GCi0');
const formRef = ref();
const queryParams = reactive({
  queryName: null,
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

const formatter = (row, column, cellValue) => {
  if (column.property === 'startTime') {
    return cellValue + '~' + row.endTime;
  } else {
    return cellValue === 0 ? '待发放' : '已发放';
  }
};

const handleGenerate = (row) => {
  const msg = renderMsg(["确定要", () => "生成兑换码", "吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    generateApi(data).then(() => {
      successMsg('兑换码生成成功');
      getPage();
    });
  });
};

const handleDelete = (row) => {
  const msg = renderMsg(["确定要", () => "删除", "该兑换码配置吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('兑换码配置删除成功');
      getPage();
    });
  });
};

const handleCdKeyPage = (row) => {
  router.push('/marketing/redeem/key/' + row.id);
};

const handleCreate = () => {
  formRef.value.openDialog({ type: 'create' });
};

const handleEdit = (row) => {
  formRef.value.openDialog({ id: row.id, type: 'edit' });
};

</script>
