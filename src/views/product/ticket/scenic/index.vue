<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="景区名称" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="待上架" :value="0" />
            <el-option label="已上架" :value="1" />
            <el-option label="强制下架" :value="2" />
          </el-select>
        </el-form-item>
        <MerchantSelect v-model="queryParams.merchantId"></MerchantSelect>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="scenicName" label="景区名称" min-width="200" />
        <el-table-column prop="coverUrl" label="图片" width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                fit="contain"
                :src="scope.row.coverUrl.split(',')[0]"
                :preview-src-list="scope.row.coverUrl.split(',')"
                style="width: 50px; height: 50px"
                preview-teleported
                hide-on-click-modal
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="景区等级" width="150" :formatter="formatter" />
        <el-table-column prop="openTime" label="营业时间" width="120" />
        <el-table-column prop="phone" label="景区电话" width="140" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="score" label="评分" width="80" />
        <el-table-column prop="minPrice" label="票价" width="150" :formatter="formatter" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'MLl0'" title="新增景区" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'PLl0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'sLl0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'fLl0'" v-show="scope.row.state === 0" type="success" :icon="Top" @click="handleShelves(scope.row)" link title="上架"></el-button>
            <el-button v-has-perm="'eLl0'" v-show="scope.row.state === 1" type="warning" :icon="Bottom" @click="handleUnShelves(scope.row)" link title="下架"></el-button>
            <el-button v-has-perm="'wLl0'" v-show="scope.row.state !== 2" type="danger" :icon="Download" @click="handlePlatformUnShelves(scope.row)" link title="强制下架"></el-button>
            <el-button v-has-perm="'1Ll0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
import { listPageApi, deleteApi, shelvesApi, unShelvesApi, platformUnShelvesApi } from '@/api/product/scenic';
import { onMounted, reactive, ref } from 'vue';
import { Edit, Delete, Plus, Top, Bottom, Download, Document, CirclePlus } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import MerchantSelect from '@/components/MerchantSelect.vue';
import Add from '@/components/icon/Add.vue';
import CreateButton from '@/components/CreateButton.vue';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('yLl0');
const queryParams = reactive({
  queryName: '',
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
  confirmMsg('确定要删除该景区吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('景区删除成功');
      getPage();
    });
  });
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'level') {
    switch (cellValue) {
      case 5:
        return '5A';
      case 4:
        return '5A';
      case 3:
        return '3A';
      default:
        return '无';
    }
  } else if (column.property === 'state') {
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
  } else if (column.property === 'minPrice') {
    const minPrice = parseFloat(cellValue);
    const maxPrice = parseFloat(row.maxPrice);
    if (minPrice === 0 && maxPrice === 0) {
      return '免费';
    }
    if (maxPrice === minPrice) {
      return cellValue;
    }
    return cellValue + '~' + row.maxPrice;
  } else {
    return cellValue;
  }
};

const handleShelves = (row) => {
  confirmMsg('确定要上架该景区吗?', () => {
    const data = { id: row.id };
    shelvesApi(data).then(() => {
      successMsg('景区上架成功');
      getPage();
    });
  });
};

const handleUnShelves = (row) => {
  confirmMsg('确定要下架该景区吗?', () => {
    const data = { id: row.id };
    unShelvesApi(data).then(() => {
      successMsg('景区下架成功');
      getPage();
    });
  });
};

const handlePlatformUnShelves = (row) => {
  confirmMsg('确定要强制下架该景区吗?', () => {
    const data = { id: row.id };
    platformUnShelvesApi(data).then(() => {
      successMsg('景区强制下架成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  router.push('/product/scenic/create');
};

const handleEdit = (row) => {
  router.push('/product/scenic/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/product/scenic/detail/' + row.id);
};
</script>
