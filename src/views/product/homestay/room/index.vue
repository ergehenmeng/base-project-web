<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="房型名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="所属民宿">
          <HomestaySelect v-model="queryParams.homestayId" class="w300"></HomestaySelect>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="待上架" :value="0" />
            <el-option label="已上架" :value="1" />
            <el-option label="强制下架" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="退款方式">
          <el-select v-model="queryParams.refundType" clearable>
            <el-option label="不支持" :value="0" />
            <el-option label="直接退款" :value="1" />
            <el-option label="审核后退款" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'ibO0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
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
        <el-table-column prop="title" label="房型名称" min-width="150" />
        <el-table-column prop="homestayTitle" label="所属民宿" min-width="150" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="roomType" label="房型" min-width="80" :formatter="formatter" />
        <el-table-column prop="recommend" min-width="80" :formatter="formatter" >
          <template #header>
            <span>平台推荐<QuestionTip content="被平台推荐的房型会在首页展示"></QuestionTip></span>
          </template>
        </el-table-column>
        <el-table-column prop="refundType" label="退款方式" min-width="80" :formatter="formatter" />
        <el-table-column prop="dimension" label="面积(m²)" width="80" />
        <el-table-column prop="resident" label="居住人数" min-width="80" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'NbO0'" title="新增房型" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'AbO0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'GbO0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'rbO0'" v-show="scope.row.state === 0" type="success" :icon="Top" @click="handleShelves(scope.row)" link title="上架"></el-button>
            <el-button v-has-perm="'RbO0'" v-show="scope.row.state === 1" type="warning" :icon="Bottom" @click="handleUnShelves(scope.row)" link title="下架"></el-button>
            <el-button v-has-perm="'abO0'" v-show="scope.row.state !== 2" type="danger" :icon="Download" @click="handlePlatformUnShelves(scope.row)" link title="强制下架"></el-button>
            <el-button v-has-perm="'hbO0'" type="success" :icon="Calendar" @click="handleCalendar(scope.row)" link title="房态价格日历"></el-button>
            <el-button v-has-perm="'dbO0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
            <el-button v-has-perm="'0bO0'" v-if="!scope.row.recommend" @click="handleRecommend(scope.row)" link title="设置平台推荐">
              <Recommend></Recommend>
            </el-button>
            <el-button v-has-perm="'0bO0'" v-if="scope.row.recommend" @click="handleRecommend(scope.row)" link title="取消平台推荐">
              <Recommended></Recommended>
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
</template>
<script setup>
import { deleteApi, exportApi, listPageApi, platformUnShelvesApi, recommendApi, shelvesApi, unShelvesApi } from '@/api/product/room';
import { Bottom, Calendar, Delete, Document, Download, Edit, Top } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import { downloadExcel } from '@/utils/common.js';
import HomestaySelect from '@/components/HomestaySelect.vue';
import CreateButton from '@/components/CreateButton.vue';
import Recommend from '@/components/icon/Recommend.vue'
import Recommended from '@/components/icon/Recommended.vue'
import QuestionTip from '@/components/QuestionTip.vue'

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('ubO0');

const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  state: null,
  refundType: null,
  homestayId: null
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
  confirmMsg('确定要删除该房型吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('房型删除成功');
      getPage();
    });
  });
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'roomType') {
    switch (cellValue) {
      case 1:
        return '标间';
      case 2:
        return '大床房';
      case 3:
        return '双人房';
      case 4:
        return '钟点房';
      case 5:
        return '套房';
      case 6:
        return '合租';
      default:
        return cellValue;
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
  } else if (column.property === 'refundType') {
    if (cellValue === 0) {
      return '不支持';
    }
    return cellValue === 1 ? '直接退款' : '审核后退款';
  } else if (column.property === 'recommend') {
    return cellValue ? '是' : '否';
  } else {
    return cellValue;
  }
};

const handleShelves = (row) => {
  confirmMsg('确定要上架该房型吗?', () => {
    const data = { id: row.id };
    shelvesApi(data).then(() => {
      successMsg('房型上架成功');
      getPage();
    });
  });
};

const handleUnShelves = (row) => {
  confirmMsg('确定要下架该房型吗?', () => {
    const data = { id: row.id };
    unShelvesApi(data).then(() => {
      successMsg('房型下架成功');
      getPage();
    });
  });
};

const handlePlatformUnShelves = (row) => {
  confirmMsg('确定要强制下架该房型吗?', () => {
    const data = { id: row.id };
    platformUnShelvesApi(data).then(() => {
      successMsg('房型强制下架成功');
      getPage();
    });
  });
};

const handleRecommend = (row) => {
  let msg;
  if (row.recommend) {
    msg = '确定要取消推荐该房型吗?';
  } else {
    msg = '确定要推荐该房型吗?';
  }
  confirmMsg(msg, () => {
    const data = { id: row.id, recommend: !row.recommend };
    recommendApi(data).then(() => {
      successMsg('房型推荐设置成功');
      getPage();
    });
  });
};

const exportLoading = ref(false);

const handleExcel = () => {
  exportLoading.value = true;
  exportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '房型列表');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const handleCalendar = (row) => {
  router.push('/product/room/calendar/' + row.id);
};

const handleCreate = () => {
  router.push('/product/room/create');
};

const handleEdit = (row) => {
  router.push('/product/room/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/product/room/detail/' + row.id);
};
</script>
