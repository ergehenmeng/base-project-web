<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="区域名称、区域编号" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="区域名称" min-width="120" />
        <el-table-column prop="code" label="区域编号" min-width="100" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="latitude" label="经纬度" width="200" :formatter="formatter" />
        <el-table-column prop="detailAddress" label="详细地址" width="250" />
        <el-table-column prop="remark" label="备注" width="250" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="250">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'vhG0'" title="新增区域" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'IXG0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'FXG0'" v-show="!scope.row.state" type="success" :icon="Top" @click="handleState(scope.row)" link title="上架"></el-button>
            <el-button v-has-perm="'FXG0'" v-show="scope.row.state" type="warning" :icon="Bottom" @click="handleState(scope.row)" link title="下架"></el-button>
            <el-button v-has-perm="'bXG0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
    <AreaForm ref="areaFormRef" @reload="getPage"></AreaForm>
  </div>
</template>
<script setup>
import { deleteApi, listPageApi, stateApi } from '@/api/poi/area';
import { Bottom, Delete, Edit, Top } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import CreateButton from '@/components/CreateButton.vue';
import AreaForm from '@/views/poi/area/AreaForm.vue';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('ohG0');
const areaFormRef = ref();
const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10
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
  confirmMsg('确定要删除该区域吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('区域删除成功');
      getPage();
    });
  });
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'state') {
    return cellValue ? h('span', { style: 'color: green' }, '已上架') : '未上架';
  } else if (column.property === 'latitude') {
    return row.longitude + '~' + cellValue;
  } else {
    return cellValue;
  }
};

const handleState = (row) => {
  let msg;
  let success;
  if (row.state) {
    msg = '确定要下架该区域吗?';
    success = '区域下架成功';
  } else {
    msg = '确定要上架该区域吗?';
    success = '区域上架成功';
  }
  confirmMsg(msg, () => {
    const data = { id: row.id, state: !row.state };
    stateApi(data).then(() => {
      successMsg(success);
      getPage();
    });
  });
};

const handleCreate = () => {
  areaFormRef.value.openDialog({});
};

const handleEdit = (row) => {
  areaFormRef.value.openDialog(row);
};
</script>
