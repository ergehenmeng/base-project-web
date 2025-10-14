<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="点位名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="区域">
          <PoiAreaSelect v-model="queryParams.areaCode"></PoiAreaSelect>
        </el-form-item>
        <el-form-item label="点位类型">
          <PoiTypeSelect v-model:area-code="queryParams.areaCode" v-model:type-id="queryParams.typeId"></PoiTypeSelect>
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
                :src="scope.row.coverUrl[0]"
                :preview-src-list="scope.row.coverUrl"
                style="width: 30px; height: 30px"
                preview-teleported
                hide-on-click-modal
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="点位名称" width="150" />
        <el-table-column prop="typeTitle" label="点位类型" width="120" />
        <el-table-column prop="areaTitle" label="所属区域" width="150" />
        <el-table-column prop="longitude" label="经纬度" width="200" :formatter="formatter" />
        <el-table-column prop="detailAddress" label="详细地址" min-width="150" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="250">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'w8G0'" title="新增点位" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'C8G0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'18G0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'z8G0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
import { deleteApi, listPageApi } from '@/api/poi/point';
import { Delete, Document, Edit } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import usePermStore from '@/store/perm';
import { useRouter } from 'vue-router';
import CreateButton from '@/components/CreateButton.vue';
import PoiAreaSelect from '@/components/PoiAreaSelect.vue';
import PoiTypeSelect from '@/components/PoiTypeSelect.vue';
import { renderMsg } from '@/utils/common.js';

const router = useRouter();
const permStore = usePermStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = permStore.hasAuth('E8G0');

const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  areaCode: null,
  typeId: null
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
  const msg = renderMsg(["确定要", () => "删除", "该线路吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('线路删除成功');
      getPage();
    });
  });
};

const formatter = (row, _column, cellValue) => {
  return cellValue + '~' + row.latitude;
};

const handleCreate = () => {
  router.push('/poi/point/create');
};

const handleEdit = (row) => {
  router.push('/poi/point/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/poi/point/detail/' + row.id);
};
</script>
