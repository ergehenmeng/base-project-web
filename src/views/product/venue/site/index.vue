<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input
            v-model="queryParams.queryName"
            placeholder="场地名称"
            clearable
            @keyup.enter="search"
          />
        </el-form-item>
        <el-form-item label="场馆名称">
          <VenueSelect v-model="queryParams.venueId" style="width: 250px"></VenueSelect>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable style="width: 130px !important">
            <el-option label="待上架" :value="0" />
            <el-option label="已上架" :value="1" />
            <el-option label="强制下架" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item class="right-button" v-has-perm="'OCO0'">
          <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table
        :data="pageData"
        style="width: 100%"
        stripe
        v-loading="loading"
        max-height="670"
        show-overflow-tooltip
      >
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
        <el-table-column prop="title" label="场地名称" min-width="180" />
        <el-table-column prop="venueName" label="所属场馆" min-width="100" />
        <el-table-column prop="state" label="状态" width="100" :formatter="formatter" />
        <el-table-column prop="sort" label="排序" width="75">
          <template #default="scope">
            <el-input
              v-model="scope.row.sort"
              @change="handleSort(scope.row)"
              maxlength="3"
              :readonly="!sortAuth"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <el-button
              v-has-perm="'NCO0'"
              type="info"
              :icon="ScaleToOriginal"
              @click="handleDetail(scope.row)"
              link
              title="价格设置"
            >
            </el-button>
            <el-button
              v-has-perm="'cCO0'"
              type="primary"
              :icon="Edit"
              @click="handleEdit(scope.row)"
              link
              title="编辑"
            >
            </el-button>
            <el-button
              v-has-perm="'DCO0'"
              v-show="scope.row.state === 0"
              type="success"
              :icon="Top"
              @click="handleShelves(scope.row)"
              link
              title="上架"
            >
            </el-button>
            <el-button
              v-has-perm="'nCO0'"
              v-show="scope.row.state === 1"
              type="warning"
              :icon="Bottom"
              @click="handleUnShelves(scope.row)"
              link
              title="下架"
            >
            </el-button>
            <el-button
              v-has-perm="'YCO0'"
              v-show="scope.row.state !== 2"
              type="danger"
              :icon="Download"
              @click="handlePlatformUnShelves(scope.row)"
              link
              title="强制下架"
            >
            </el-button>
            <el-button
              v-has-perm="'uCO0'"
              type="danger"
              :icon="Delete"
              @click="handleDelete(scope.row)"
              link
              title="删除"
            >
            </el-button>
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
  <SiteForm ref="formRef" @reload="getPage"></SiteForm>
</template>
<script setup>
import {
  listPageApi,
  deleteApi,
  shelvesApi,
  unShelvesApi,
  platformUnShelvesApi,
  sortApi
} from '@/api/product/site';
import { onMounted, reactive, ref } from 'vue';
import {
  Edit,
  Delete,
  Plus,
  Top,
  Bottom,
  Download,
  ScaleToOriginal
} from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import VenueSelect from '@/components/VenueSelect.vue';
import SiteForm from '@/views/product/venue/site/SiteForm.vue';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('lCO0');
const sortAuth = userStore.hasAuth('uCO0');
const formRef = ref();

const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  state: null,
  venueId: null
});

const handleSort = (row) => {
  const data = { id: row.id, sortBy: row.sort };
  sortApi(data).then(() => {
    getPage();
  });
};

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
  confirmMsg('确定要删除该场地吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('场地删除成功');
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
  confirmMsg('确定要上架该场地吗?', () => {
    const data = { id: row.id };
    shelvesApi(data).then(() => {
      successMsg('场地上架成功');
      getPage();
    });
  });
};

const handleUnShelves = (row) => {
  confirmMsg('确定要下架该场地吗?', () => {
    const data = { id: row.id };
    unShelvesApi(data).then(() => {
      successMsg('场地下架成功');
      getPage();
    });
  });
};

const handlePlatformUnShelves = (row) => {
  confirmMsg('确定要强制下架该场地吗?', () => {
    const data = { id: row.id };
    platformUnShelvesApi(data).then(() => {
      successMsg('场地强制下架成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  formRef.value.openDialog({});
};

const handleEdit = (row) => {
  formRef.value.openDialog(row);
};
const handleDetail = (row) => {
  router.push('/product/site/detail/' + row.id);
};
</script>
