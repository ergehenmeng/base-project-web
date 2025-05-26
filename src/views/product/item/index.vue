<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="auto" >
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="商品名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable class="w110">
            <el-option label="待上架" :value="0" />
            <el-option label="已上架" :value="1" />
            <el-option label="强制下架" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="交付方式">
          <el-select v-model="queryParams.deliveryType" clearable class="w110">
            <el-option label="快递包邮" :value="1" />
            <el-option label="自提" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input class="w80" v-model="queryParams.minPrice" @keyup="queryParams.minPrice = numberValidator(queryParams.minPrice)" maxlength="6"></el-input>
          ~
          <el-input class="w80" v-model="queryParams.maxPrice" @keyup="queryParams.maxPrice = numberValidator(queryParams.maxPrice)" maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <ItemTag v-model="queryParams.tagList"></ItemTag>
        </el-form-item>
        <el-form-item label="所属店铺">
          <StoreSelect v-model="queryParams.storeId" class="w220"></StoreSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'oSO0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="coverUrl" label="封面图片" min-width="80">
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
        <el-table-column prop="title" label="商品名称" min-width="140" />
        <el-table-column prop="storeName" label="所属店铺" min-width="140" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="deliveryType" label="交付方式" width="100" :formatter="formatter" />
        <el-table-column prop="minPrice" label="价格" width="130" :formatter="formatter" />
        <el-table-column prop="saleNum"  width="80" >
          <template #header>
            <span>销量<QuestionTip content="注意：该销量不含虚拟销量"></QuestionTip></span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80">
          <template #default="scope">
            <el-input v-model="scope.row.sort" @change="handleSort(scope.row)" maxlength="3" :readonly="!sortAuth" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="recommend" width="100" :formatter="(row, column, cellValue) => cellValue ? '是': '否'" >
          <template #header>
            <span>平台推荐<QuestionTip content="被平台推荐的商品会在首页展示"></QuestionTip></span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        <el-table-column label="操作" fixed="right" width="210">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'jSO0'" title="新增零售商品" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'2SO0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'IyO0'" @click="showStock(scope.row)" link title="增加库存">
              <Stock></Stock>
            </el-button>
            <el-button v-has-perm="'gSO0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'mSO0'" v-show="scope.row.state === 0" type="success" :icon="Top" @click="handleShelves(scope.row)" link title="上架"></el-button>
            <el-button v-has-perm="'BSO0'" v-show="scope.row.state === 1" type="warning" :icon="Bottom" @click="handleUnShelves(scope.row)" link title="下架"></el-button>
            <el-button v-has-perm="'WSO0'" v-show="scope.row.state !== 2" type="danger" :icon="Download" @click="handlePlatformUnShelves(scope.row)" link title="强制下架"></el-button>
            <el-button v-has-perm="'vSO0'" type="primary" :icon="Link" @click="handleLink(scope.row)" link title="生成链接"></el-button>
            <el-button v-has-perm="'TSO0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
            <el-button v-has-perm="'3SO0'" v-show="!scope.row.recommend" @click="handleRecommend(scope.row)" link title="设置平台推荐">
              <Recommend></Recommend>
            </el-button>
            <el-button v-has-perm="'3SO0'" v-show="scope.row.recommend" @click="handleRecommend(scope.row)" link title="取消平台推荐">
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
  <StockForm ref="stockFormRef" @reload="getPage"/>
</template>
<script setup>
import { deleteApi, exportApi, listPageApi, platformUnShelvesApi, recommendApi, shelvesApi, sortApi, unShelvesApi } from '@/api/product/item';
import { Bottom, Delete, Document, Download, Edit, Link, Top } from '@element-plus/icons-vue';
import { confirmMsg, messageBox, successMsg } from '@/utils/message'
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import { downloadExcel, numberValidator, renderMsg } from '@/utils/common.js'
import ItemTag from '@/components/ItemTag.vue';
import StoreSelect from '@/components/StoreSelect.vue';
import CreateButton from '@/components/CreateButton.vue';
import QuestionTip from '@/components/QuestionTip.vue'
import { shortUrlApi } from '@/api/common/index.js'
import { useClipboard } from '@vueuse/core'
import Recommend from '@/components/icon/Recommend.vue'
import Recommended from '@/components/icon/Recommended.vue'
import StockForm from '@/views/product/item/StockForm.vue'
import Stock from '@/components/icon/Stock.vue'

const { copy, isSupported } = useClipboard();
const shortUrl = import.meta.env.VITE_ITEM_SHORT_URL;
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('8SO0');
const sortAuth = userStore.hasAuth('LSO0');
const stockFormRef = ref();
const exportLoading = ref(false);

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  minPrice: null,
  maxPrice: null,
  deliveryType: null,
  tagList: [],
  storeId: null
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      if (queryParams.tagList.length > 0) {
        queryParams.tagId = queryParams.tagList[0];
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
  const msg = renderMsg(["确定要", () => "删除", "该商品吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('商品删除成功');
      getPage();
    });
  });
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'state') {
    if (cellValue === 0) {
      return '待上架';
    }
    return cellValue === 1 ? h('span', { style: 'color: green;' }, '已上架') : h('span', { style: 'color: red;', title: '被平台强制下级后无法继续上架' }, '强制下架');
  } else if (column.property === 'deliveryType') {
    if (cellValue === 1) {
      return '快递';
    } else if (cellValue === 2) {
      return '自提';
    } else if (cellValue === 3) {
      return '快递/自提';
    }
  } else if (column.property === 'minPrice') {
    if (cellValue === row.maxPrice) {
      return cellValue;
    }
    return cellValue + '~' + row.maxPrice;
  } else {
    return cellValue;
  }
};

const handleShelves = (row) => {
  const msg = renderMsg(["确定要", () => "上架", "该商品吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    shelvesApi(data).then(() => {
      successMsg('商品上架成功');
      getPage();
    });
  });
};

const handleSort = (row) => {
  if (!sortAuth) {
    return;
  }
  const data = { id: row.id, sortBy: row.sort };
  sortApi(data).then(() => {
    successMsg('排序更新成功');
    getPage();
  });
};

const handleUnShelves = (row) => {
  const msg = renderMsg(["确定要", () => "下架", "该商品吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    unShelvesApi(data).then(() => {
      successMsg('商品下架成功');
      getPage();
    });
  });
};

const handlePlatformUnShelves = (row) => {
  const msg = renderMsg(["确定要", () => "强制下架", "该商品吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    platformUnShelvesApi(data).then(() => {
      successMsg('商品强制下架成功');
      getPage();
    });
  });
};

const showStock = (row) => {
  stockFormRef.value.openDialog({ itemId: row.id, title: row.title});
};

const handleRecommend = (row) => {
  let msg;
  if (row.recommend) {
    msg = renderMsg(["确定要", () => "取消推荐", "该商品吗?"]);
  } else {
    msg = renderMsg(["确定要", () => "推荐", "该商品吗?"]);
  }
  confirmMsg(msg, () => {
    const data = { id: row.id, recommend: !row.recommend };
    recommendApi(data).then(() => {
      successMsg('商品推荐设置成功');
      getPage();
    });
  });
};

const handleExcel = () => {
  exportLoading.value = true;
  exportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '零售列表');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const handleCreate = () => {
  router.push('/product/item/create');
};

const handleEdit = (row) => {
  router.push('/product/item/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/product/item/detail/' + row.id);
};

const handleLink = (row) => {
  loading.value = true
  shortUrlApi({ pageUrl: shortUrl + row.id, pageTitle: row.title, persistent: true}).then(({data}) => {
    if (isSupported) {
      copy(data);
      successMsg('链接复制成功');
    } else {
      messageBox(data);
    }
  }).finally(() => {
    loading.value = false
  })
};
</script>
