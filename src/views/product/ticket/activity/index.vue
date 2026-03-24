<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="活动名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="景区">
          <ScenicSelect v-model="queryParams.scenicId" style="width: 300px !important"></ScenicSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="标题" width="250" />
        <el-table-column prop="scenicName" label="所属景区" width="250" />
        <el-table-column prop="startDate" label="活动日期" width="280" :formatter="formatter"/>
        <el-table-column prop="address" label="活动地址" min-width="200" :formatter="formatter"/>
        <el-table-column prop="click" label="评价" width="80">
          <template #default="scope">
            <el-switch v-model="scope.row.commentSupport" inline-prompt active-text="是" inactive-text="否" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column prop="updateTime" label="更新时间" width="160" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'6xO0'" title="新增活动" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'xxO0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'txO0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
import { deleteApi, listPageApi } from '@/api/product/activity';
import { Delete, Edit } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import usePermStore from '@/store/perm';
import CreateButton from '@/components/CreateButton.vue';
import { renderMsg } from '@/utils/common.js'
import ScenicSelect from '@/components/ScenicSelect.vue'
import { useRouter } from 'vue-router'

const permStore = usePermStore();

const loading = ref(false);
const total = ref(0);
const router = useRouter();
const pageData = ref([]);
const selectAuth = permStore.hasAuth('VxO0');

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  scenicId: null
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

const handleDelete = (row) => {
  const msg = renderMsg(["确定要", () => "删除", "该活动吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('活动删除成功');
      getPage();
    });
  });
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'startDate') {
    return cellValue + "~" + row.endDate;
  } else {
    return cellValue;
  }
};

const handleCreate = () => {
  router.push('/product/activity/create');
};

const handleEdit = (row) => {
  router.push('/product/activity/edit/' + row.id);
};
</script>
