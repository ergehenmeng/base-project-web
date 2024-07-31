<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="线路名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="旅行社">
          <TravelSelect v-model="queryParams.travelAgencyId" class="w220"></TravelSelect>
        </el-form-item>
        <el-form-item label="游玩天数">
          <el-select v-model="queryParams.duration" clearable class="w120">
            <el-option label="一日游" :value="1" />
            <el-option label="二日游" :value="2" />
            <el-option label="三日游" :value="3" />
            <el-option label="四日游" :value="4" />
            <el-option label="五日游" :value="5" />
            <el-option label="六日游" :value="6" />
            <el-option label="七日游" :value="7" />
            <el-option label="八日游" :value="8" />
            <el-option label="九日游" :value="9" />
            <el-option label="十日游" :value="10" />
            <el-option label="十一日游" :value="11" />
            <el-option label="十二日游" :value="12" />
            <el-option label="十三日游" :value="13" />
            <el-option label="十四日游" :value="14" />
            <el-option label="十五日游" :value="15" />
          </el-select>
        </el-form-item>
        <el-form-item label="出发城市">
          <ProvinceCitySelect v-model="queryParams.areaList"></ProvinceCitySelect>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable class="w120">
            <el-option label="待上架" :value="0" />
            <el-option label="已上架" :value="1" />
            <el-option label="强制下架" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'nvl0'">
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
                fit="cover"
                :src="scope.row.coverUrl?.split(',')[0]"
                :preview-src-list="scope.row.coverUrl?.split(',')"
                style="width: 50px; height: 50px"
                preview-teleported
                hide-on-click-modal
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="线路名称" min-width="200" />
        <el-table-column prop="travelAgencyName" label="所属旅行社" min-width="200" />
        <el-table-column prop="startProvinceId" label="出发城市" min-width="120" :formatter="formatter" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="saleNum" label="真实销量" width="80" />
        <el-table-column prop="duration" label="游玩天数" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'tvl0'" title="新增线路" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'Kvl0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'Jvl0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'5vl0'" v-show="scope.row.state === 0" type="success" :icon="Top" @click="handleShelves(scope.row)" link title="上架"></el-button>
            <el-button v-has-perm="'Zvl0'" v-show="scope.row.state === 1" type="warning" :icon="Bottom" @click="handleUnShelves(scope.row)" link title="下架"></el-button>
            <el-button v-has-perm="'kvl0'" v-show="scope.row.state !== 2" type="danger" :icon="Download" @click="handlePlatformUnShelves(scope.row)" link title="强制下架"></el-button>
            <el-button v-has-perm="'Ovl0'" type="success" :icon="Calendar" @click="handleCalendar(scope.row)" link title="查看价格日历"></el-button>
            <el-button v-has-perm="'lvl0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
import { deleteApi, exportApi, listPageApi, platformUnShelvesApi, shelvesApi, unShelvesApi } from '@/api/product/line';
import { Bottom, Calendar, Delete, Document, Download, Edit, Top } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import ProvinceCitySelect from '@/components/ProvinceCitySelect.vue';
import useAreaStore from '@/store/area.js';
import TravelSelect from '@/components/TravelSelect.vue';
import { downloadExcel } from '@/utils/common.js';
import CreateButton from '@/components/CreateButton.vue';

const areaStore = useAreaStore();
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('xvl0');

const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  state: null,
  travelAgencyId: null,
  startCityId: null,
  duration: null,
  areaList: []
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      if (queryParams.areaList.length === 2) {
        queryParams.startCityId = queryParams.areaList[1];
      }
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
  confirmMsg('确定要删除该线路吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('线路删除成功');
      getPage();
    });
  });
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'startProvinceId') {
    return areaStore.parseCity(row.startProvinceId, row.startCityId);
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
  } else {
    return cellValue;
  }
};

const handleShelves = (row) => {
  confirmMsg('确定要上架该线路吗?', () => {
    const data = { id: row.id };
    shelvesApi(data).then(() => {
      successMsg('线路上架成功');
      getPage();
    });
  });
};

const handleUnShelves = (row) => {
  confirmMsg('确定要下架该线路吗?', () => {
    const data = { id: row.id };
    unShelvesApi(data).then(() => {
      successMsg('线路下架成功');
      getPage();
    });
  });
};

const handlePlatformUnShelves = (row) => {
  confirmMsg('确定要强制下架该线路吗?', () => {
    const data = { id: row.id };
    platformUnShelvesApi(data).then(() => {
      successMsg('线路强制下架成功');
      getPage();
    });
  });
};

const exportLoading = ref(false);

const handleExcel = () => {
  exportLoading.value = true;
  exportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '线路列表');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const handleCalendar = (row) => {
  router.push('/product/line/calendar/' + row.id);
};

const handleCreate = () => {
  router.push('/product/line/create');
};

const handleEdit = (row) => {
  router.push('/product/line/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/product/line/detail/' + row.id);
};
</script>
