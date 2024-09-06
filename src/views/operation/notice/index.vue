<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="标题" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="公告类型">
          <el-select v-model="queryParams.noticeType" clearable>
            <el-option v-for="item in dictList" :key="item.id" :label="item.showValue" :value="item.hiddenValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="未发布" :value="0" />
            <el-option label="已发布" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="coverUrl" label="封面图" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                fit="cover"
                :src="scope.row.coverUrl?.split(',')[0]"
                :preview-src-list="scope.row.coverUrl?.split(',')"
                style="width: 30px; height: 30px"
                preview-teleported
                hide-on-click-modal
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="noticeType" label="公告类型" :formatter="formatter" />
        <el-table-column prop="state" label="发布状态" :formatter="formatter" >
          <template #default="scope">
            <el-switch v-model="scope.row.state" :inactive-value="0" :active-value="1" inline-prompt active-text="已发布" inactive-text="未发布" disabled style="--el-switch-off-color: #ff4949" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'DJU0'" title="新增公告" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'kJU0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'lJU0'" v-show="scope.row.state === 0" type="primary" :icon="Top" @click="handlePublish(scope.row)" link title="发布"></el-button>
            <el-button v-has-perm="'OJU0'" v-show="scope.row.state === 1" type="warning" :icon="Bottom" @click="handleCancel(scope.row)" link title="下架"></el-button>
            <el-button v-has-perm="'cJU0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
</template>
<script setup>
import { cancelApi, deleteApi, listPageApi, publishApi } from '@/api/operation/notice';
import { Bottom, Delete, Edit, Top } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import useDictStore from '@/store/dict.js';
import { useRouter } from 'vue-router';
import CreateButton from '@/components/CreateButton.vue';

const router = useRouter();
const userStore = useUserStore();
const dictStore = useDictStore();
const dictList = dictStore.getDict('notice_type');

const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('UJU0');

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  noticeType: null
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

const handleEdit = (row) => {
  router.push('/operation/notice/edit/' + row.id);
};

const handleDelete = (row) => {
  confirmMsg('确定要删除该公告信息吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('公告信息删除成功');
      getPage();
    });
  });
};

const handlePublish = (row) => {
  confirmMsg('确定要上架该公告信息吗?', () => {
    const data = { id: row.id };
    publishApi(data).then(() => {
      successMsg('公告上架成功');
      getPage();
    });
  });
};

const handleCancel = (row) => {
  confirmMsg('确定要下架该公告信息吗?', () => {
    const data = { id: row.id };
    cancelApi(data).then(() => {
      successMsg('公告下架成功');
      getPage();
    });
  });
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'noticeType') {
    return dictStore.parseDict('notice_type', cellValue);
  } else {
    return cellValue;
  }
};
const handleCreate = () => {
  router.push('/operation/notice/create');
};
</script>
