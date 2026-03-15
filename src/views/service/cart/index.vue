<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="商品名称" clearable @keyup.enter="search" maxlength="30" class="w220"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable class="w110">
            <el-option label="待上架" :value="0" />
            <el-option label="已上架" :value="1" />
            <el-option label="强制下架" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否热销">
          <el-select v-model="queryParams.hotSell" clearable>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input class="w80" v-model="queryParams.minPrice" @keyup="queryParams.minPrice = numberValidator(queryParams.minPrice)" maxlength="6"></el-input>
          ~
          <el-input class="w80" v-model="queryParams.maxPrice" @keyup="queryParams.maxPrice = numberValidator(queryParams.maxPrice)" maxlength="6"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="orderNo" label="商品图片" width="100" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                fit="cover"
                :src="scope.row.coverUrl && scope.row.coverUrl[0]"
                :preview-src-list="scope.row.coverUrl"
                style="width: 30px; height: 30px"
                preview-teleported
                hide-on-click-modal
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名称" min-width="150" />
        <el-table-column prop="minPrice" label="价格" min-width="100" :formatter="formatter"/>
        <el-table-column prop="hotSell" label="是否热销" min-width="80" :formatter="(row, column, cellValue) => cellValue ? '是' : '否'"/>
        <el-table-column prop="quantity" label="商品数量" min-width="80" />
        <el-table-column prop="state" label="状态" min-width="100" :formatter="formatter"/>
        <el-table-column prop="saleNum" label="销售数量" min-width="100" />
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
import { listPageApi } from '@/api/service/cart';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import { numberValidator } from '@/utils/common.js'

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('uU20');
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  hotSell: null,
  minPrice: null,
  maxPrice: null,
  state: null
});

const formatter = (row, column, cellValue) => {
  if (column.property === 'state') {
    switch (cellValue) {
      case 0:
        return '待上架';
      case 1:
        return '已上架';
      case 2:
        return h('span', { style: 'color: red'}, '强制下架');
    }
  } else {
    if (cellValue === row.maxPrice) {
      return cellValue;
    }
    return cellValue + '~' + row.maxPrice;
  }
}

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


</script>
