<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="场馆名称" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="场馆类型">
          <el-select v-model="queryParams.venueType" clearable class="w130">
            <el-option label="篮球馆" :value="1" />
            <el-option label="网球馆" :value="2" />
            <el-option label="羽毛球馆" :value="3" />
            <el-option label="乒乓球馆" :value="4" />
            <el-option label="游泳馆" :value="5" />
            <el-option label="健身馆" :value="6" />
            <el-option label="瑜伽馆" :value="7" />
            <el-option label="保龄馆" :value="8" />
            <el-option label="足球馆" :value="9" />
            <el-option label="排球馆" :value="10" />
            <el-option label="田径馆" :value="11" />
            <el-option label="综合馆" :value="12" />
            <el-option label="跆拳道馆" :value="13" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable style="width: 130px !important">
            <el-option label="待上架" :value="0" />
            <el-option label="已上架" :value="1" />
            <el-option label="强制下架" :value="2" />
          </el-select>
        </el-form-item>
        <MerchantSelect v-model="queryParams.merchantId"></MerchantSelect>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'owO0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="coverUrl" label="封面图片" min-width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                fit="contain"
                :src="scope.row.coverUrl?.split(',')[0]"
                :preview-src-list="scope.row.coverUrl?.split(',')"
                style="width: 50px; height: 50px"
                preview-teleported
                hide-on-click-modal
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="场馆名称" min-width="180" />
        <el-table-column prop="venueType" label="场馆类型" min-width="100" :formatter="formatter" />
        <el-table-column prop="state" label="状态" width="100" :formatter="formatter" />
        <el-table-column prop="openTime" label="营业时间" width="150" />
        <el-table-column prop="telephone" label="商家电话" width="150" />
        <el-table-column prop="detailAddress" label="详细地址" width="200" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'mwO0'" title="新增场馆" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'LwO0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'BwO0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'7wO0'" v-show="scope.row.state === 0" type="success" :icon="Top" @click="handleShelves(scope.row)" link title="上架"></el-button>
            <el-button v-has-perm="'WwO0'" v-show="scope.row.state === 1" type="warning" :icon="Bottom" @click="handleUnShelves(scope.row)" link title="下架"></el-button>
            <el-button v-has-perm="'3wO0'" v-show="scope.row.state !== 2" type="danger" :icon="Download" @click="handlePlatformUnShelves(scope.row)" link title="强制下架"></el-button>
            <el-button v-has-perm="'TwO0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
import { deleteApi, exportApi, listPageApi, platformUnShelvesApi, shelvesApi, unShelvesApi } from '@/api/product/venue';
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
const selectAuth = userStore.hasAuth('2wO0');

const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  state: null,
  venueType: null,
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
  confirmMsg('确定要删除该场馆吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('场馆删除成功');
      getPage();
    });
  });
};

const formatter = (row, column, cellValue) => {
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
  } else if (column.property === 'venueType') {
    switch (cellValue) {
      case 1:
        return '篮球馆';
      case 2:
        return '网球馆';
      case 3:
        return '羽毛球馆';
      case 4:
        return '乒乓球馆';
      case 5:
        return '游泳馆';
      case 6:
        return '健身馆';
      case 7:
        return '瑜伽馆';
      case 8:
        return '保龄馆';
      case 9:
        return '足球馆';
      case 10:
        return '排球馆';
      case 11:
        return '田径馆';
      case 12:
        return '综合馆';
      case 13:
        return '跆拳道馆';
      default:
        return cellValue;
    }
  } else {
    return cellValue;
  }
};

const handleShelves = (row) => {
  confirmMsg('确定要上架该场馆吗?', () => {
    const data = { id: row.id };
    shelvesApi(data).then(() => {
      successMsg('场馆上架成功');
      getPage();
    });
  });
};

const handleUnShelves = (row) => {
  confirmMsg('确定要下架该场馆吗?', () => {
    const data = { id: row.id };
    unShelvesApi(data).then(() => {
      successMsg('场馆下架成功');
      getPage();
    });
  });
};

const handlePlatformUnShelves = (row) => {
  confirmMsg('确定要强制下架该场馆吗?', () => {
    const data = { id: row.id };
    platformUnShelvesApi(data).then(() => {
      successMsg('场馆强制下架成功');
      getPage();
    });
  });
};

const exportLoading = ref(false);

const handleExcel = () => {
  exportLoading.value = true;
  exportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '场馆列表');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const handleCreate = () => {
  router.push('/product/venue/create');
};

const handleEdit = (row) => {
  router.push('/product/venue/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/product/venue/detail/' + row.id);
};
</script>
