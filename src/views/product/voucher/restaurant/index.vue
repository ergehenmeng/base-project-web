<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="商家名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable class="w130">
            <el-option label="待上架" :value="0" />
            <el-option label="已上架" :value="1" />
            <el-option label="强制下架" :value="2" />
          </el-select>
        </el-form-item>
        <MerchantSelect v-model="queryParams.merchantId"></MerchantSelect>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'nMO0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="coverUrl" label="店铺logo" width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image fit="cover" :src="scope.row.logoUrl" style="width: 50px; height: 50px" preview-teleported hide-on-click-modal />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商家名称" min-width="150" />
        <el-table-column prop="merchantName" label="所属商户" min-width="150" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="openTime" label="营业时间" width="180" />
        <el-table-column prop="phone" label="商家热线" width="120" />
        <el-table-column prop="detailAddress" label="详细地址" width="180" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'ZMO0'" title="新增餐饮店" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'DMO0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'UMO0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'kMO0'" v-show="scope.row.state === 0" type="success" :icon="Top" @click="handleShelves(scope.row)" link title="上架"></el-button>
            <el-button v-has-perm="'lMO0'" v-show="scope.row.state === 1" type="warning" :icon="Bottom" @click="handleUnShelves(scope.row)" link title="下架"></el-button>
            <el-button v-has-perm="'cMO0'" v-show="scope.row.state !== 2" type="danger" :icon="Download" @click="handlePlatformUnShelves(scope.row)" link title="强制下架"></el-button>
            <el-button v-has-perm="'YMO0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
import { deleteApi, exportApi, listPageApi, platformUnShelvesApi, shelvesApi, unShelvesApi } from '@/api/product/restaurant';
import { Bottom, Delete, Document, Download, Edit, Top } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import { downloadExcel } from '@/utils/common.js';
import MerchantSelect from '@/components/MerchantSelect.vue';
import CreateButton from '@/components/CreateButton.vue';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('5MO0');

const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  state: null,
  merchantId: null
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
  confirmMsg('确定要删除该商家吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('商家删除成功');
      getPage();
    });
  });
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'state') {
    if (cellValue === 0) {
      return '待上架';
    }
    return cellValue === 1
      ? h('span', { style: 'color: green;' }, '已上架')
      : h(
          'span',
          {
            style: 'color: red;',
            title: '被平台强制下级后无法继续上架'
          },
          '强制下架'
        );
  } else {
    return cellValue;
  }
};

const handleShelves = (row) => {
  confirmMsg('确定要上架该商家吗?', () => {
    const data = { id: row.id };
    shelvesApi(data).then(() => {
      successMsg('商家上架成功');
      getPage();
    });
  });
};

const handleUnShelves = (row) => {
  confirmMsg('确定要下架该商家吗?', () => {
    const data = { id: row.id };
    unShelvesApi(data).then(() => {
      successMsg('商家下架成功');
      getPage();
    });
  });
};

const handlePlatformUnShelves = (row) => {
  confirmMsg('确定要强制下架该商家吗?', () => {
    const data = { id: row.id };
    platformUnShelvesApi(data).then(() => {
      successMsg('商家强制下架成功');
      getPage();
    });
  });
};

const exportLoading = ref(false);

const handleExcel = () => {
  exportLoading.value = true;
  exportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '餐饮店列表');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const handleCreate = () => {
  router.push('/product/restaurant/create');
};

const handleEdit = (row) => {
  router.push('/product/restaurant/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/product/restaurant/detail/' + row.id);
};
</script>
