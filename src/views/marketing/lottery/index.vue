<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="活动名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="未开始" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="已结束" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="活动名称" min-width="200" />
        <el-table-column prop="startTime" label="活动时间" width="300" :formatter="formatter" />
        <el-table-column prop="state" label="状态" width="100" :formatter="formatter" />
        <el-table-column prop="lotteryDay" label="单日抽奖次数限制" width="150" />
        <el-table-column prop="lotteryTotal" label="总抽奖次数限制" width="150" />
        <el-table-column prop="winNum" label="中奖次数限制" width="150" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="210">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'vwi0'" title="新增抽奖活动" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'F1i0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'I1i0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'H1i0'" type="primary" @click="handleLog(scope.row)" link title="抽奖记录"><Lottery/></el-button>
            <el-button v-has-perm="'b1i0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
</template>
<script setup>
import { deleteApi, listPageApi } from '@/api/marketing/lottery';
import { Delete, Document, Edit } from '@element-plus/icons-vue';
import usePermStore from '@/store/perm';
import { useRouter } from 'vue-router';
import CreateButton from '@/components/CreateButton.vue';
import { confirmMsg, successMsg } from '@/utils/message.js';
import Lottery from '@/components/icon/Lottery.vue'
import { renderMsg } from '@/utils/common.js'

const router = useRouter();
const permStore = usePermStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = permStore.hasAuth('owi0');
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
  } else if (cellValue === 0) {
    return '未开始';
  } else if (cellValue === 1) {
    return '进行中';
  } else {
    return '已结束';
  }
};

const handleDelete = (row) => {
  const msg = renderMsg(["确定要", () => "删除", "该抽奖活动吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('抽奖活动删除成功');
      getPage();
    });
  });
};

const handleLog = (row) => {
  router.push('/marketing/lottery/log/' + row.id);
};

const handleCreate = () => {
  router.push('/marketing/lottery/create');
};

const handleEdit = (row) => {
  router.push('/marketing/lottery/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/marketing/lottery/detail/' + row.id);
};
</script>
