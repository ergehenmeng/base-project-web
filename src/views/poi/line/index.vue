<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="线路名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="区域">
          <PoiAreaSelect v-model="queryParams.areaCode"></PoiAreaSelect>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="上架" :value="1"></el-option>
            <el-option label="未上架" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
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
                style="width: 30px; height: 30px"
                preview-teleported
                hide-on-click-modal
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="线路名称" min-width="150" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="areaTitle" label="所属区域" min-width="150" />
        <el-table-column prop="playTime" label="预计游玩时间(小时)" min-width="180" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="250">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'gjG0'" title="新增线路" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'mjG0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'2jG0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'3jG0'" v-show="scope.row.state === 0" type="success" :icon="Top" @click="handleShelves(scope.row)" link title="上架"></el-button>
            <el-button v-has-perm="'LjG0'" v-show="scope.row.state === 1" type="warning" :icon="Bottom" @click="handleUnShelves(scope.row)" link title="下架"></el-button>
            <el-button v-has-perm="'BjG0'" type="primary" :icon="MapLocation" @click="handleBind(scope.row)" link title="绑定点位"></el-button>
            <el-button v-has-perm="'WjG0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
import { deleteApi, listPageApi, shelvesApi, unShelvesApi } from '@/api/poi/line';
import { Bottom, Delete, Document, Edit, MapLocation, Top } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import CreateButton from '@/components/CreateButton.vue';
import PoiAreaSelect from '@/components/PoiAreaSelect.vue';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('jjG0');

const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  areaCode: null,
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

const handleDelete = (row) => {
  confirmMsg('确定要删除该线路吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('线路删除成功');
      getPage();
    });
  });
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

const handleBind = (row) => {
  router.push({
    path: '/poi/line/bind/' + row.id,
    query: {
      lng: row.longitude,
      lat: row.latitude
    }
  });
};

const formatter = (_row, _column, cellValue) => {
  return cellValue === 0 ? '未上架' : h('span', { style: 'color: green;' }, '上架');
};

const handleCreate = () => {
  router.push('/poi/line/create');
};

const handleEdit = (row) => {
  router.push('/poi/line/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/poi/line/detail/' + row.id);
};
</script>
