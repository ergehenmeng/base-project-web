<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="活动名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="活动名称" min-width="200" />
        <el-table-column prop="startTime" label="活动时间" width="320" :formatter="formatter" />
        <el-table-column prop="state" width="80" :formatter="formatter" >
          <template #header>
            <span>状态</span><QuestionTip content="注意：已开始或已结束的活动不支持编辑"/>
          </template>
        </el-table-column>
        <el-table-column prop="advanceHour" label="提前预告(小时)" width="120" :formatter="formatter"/>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column prop="remark" label="备注信息" min-width="200" />
        <el-table-column label="操作" fixed="right" width="210">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'KEi0'" title="新增限时购活动" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'ZEi0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'5Ei0'" v-if="scope.row.state === 0 " type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'UEi0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
import { deleteApi, listPageApi } from '@/api/marketing/limit';
import { Delete, Document, Edit } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import CreateButton from '@/components/CreateButton.vue';
import { confirmMsg, successMsg } from '@/utils/message.js';
import { renderMsg } from '@/utils/common.js'
import QuestionTip from '@/components/QuestionTip.vue'

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('JEi0');
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
  if (column.property === "startTime") {
    return cellValue + '~' + row.endTime;
  } else if (column.property === 'state') {
    if (cellValue === 0) {
      return '未开始';
    }
    if (cellValue === 1) {
      return h('span', { style: { color: '#00a8ff' } }, '进行中');
    }
    if (cellValue === 2) {
      return h('span', { style: { color: '#ffa502' } }, '已结束');
    }
  } else {
    return h('span', { title: '提前' + cellValue + "小时进行活动预告" }, cellValue);
  }
};

const handleDelete = (row) => {
  const msg = renderMsg(["确定要", () => "删除", "该限时购活动吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('限时购活动删除成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  router.push('/marketing/limit/create');
};

const handleEdit = (row) => {
  router.push('/marketing/limit/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/marketing/limit/detail/' + row.id);
};
</script>
