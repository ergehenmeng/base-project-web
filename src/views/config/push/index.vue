<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="消息标题、消息编号" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="开启" :value="true" />
            <el-option label="关闭" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="消息标题" width="200" />
        <el-table-column prop="nid" label="消息编号" width="150" />
        <el-table-column prop="state" label="状态" width="100" :formatter="formatter" />
        <el-table-column prop="content" label="内容" min-width="250" />
        <el-table-column prop="tag" label="跳转页面" width="150" />
        <el-table-column prop="remark" label="备注信息" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="scope">
            <el-button v-has-perm="'QtR0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
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
  <PushForm ref="pushFormRef" @reload="getPage"></PushForm>
</template>
<script setup>
import { listPageApi } from '@/api/config/push';
import { Edit } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import PushForm from '@/views/config/push/PushForm.vue';

const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const pushFormRef = ref();
const selectAuth = userStore.hasAuth('ztR0');

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

const formatter = (_row, column, cellValue) => {
  if (column.property === 'state') {
    return cellValue
      ? h('span', { style: 'color: green;' }, '开启')
      : h(
          'span',
          {
            style: 'color: red;',
            title: '关闭后不会触发消息推送'
          },
          '关闭'
        );
  } else {
    return cellValue;
  }
};

const handleEdit = (row) => {
  pushFormRef.value.openDialog(row);
};
</script>
