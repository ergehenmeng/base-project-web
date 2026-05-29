<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="订单编号" clearable @keyup.enter="search" maxlength="30" class="w220" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable class="w100">
            <el-option label="正常" :value="1" />
            <el-option label="屏蔽" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="queryParams.productType" clearable class="w120">
            <el-option label="零售" value="item" />
            <el-option label="门票" value="ticket" />
            <el-option label="民宿" value="homestay" />
            <el-option label="餐饮" value="voucher" />
            <el-option label="场馆" value="venue" />
            <el-option label="线路" value="line" />
          </el-select>
        </el-form-item>
        <el-form-item label="评价类型">
          <el-select v-model="queryParams.queryType" clearable class="w120">
            <el-option label="好评" :value="0" />
            <el-option label="中评" :value="1" />
            <el-option label="差评" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="650" show-overflow-tooltip>
        <el-table-column prop="orderNo" label="商品图片" width="80">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image fit="cover" :src="scope.row.coverUrl[0]" :preview-src-list="scope.row.coverUrl" style="width: 30px; height: 30px" preview-teleported hide-on-click-modal />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productTitle" label="商品名称" min-width="180" :formatter="formatter" />
        <el-table-column prop="productType" label="商品类型" width="80" :formatter="(row, column, cellValue) => parseProductType(cellValue)" />
        <el-table-column prop="orderNo" label="订单编号" width="200" />
        <el-table-column prop="score" label="综合评分" width="80" />
        <el-table-column prop="storeScore" label="店铺评分" width="80" />
        <el-table-column prop="comment" label="评论" min-width="150" />
        <el-table-column prop="commentPic" label="评论图片" width="80">
          <template #default="scope">
            <div style="display: flex; align-items: center" v-if="scope.row.commentPic && scope.row.commentPic.length > 0">
              <el-image fit="cover" :src="scope.row.commentPic[0]" :preview-src-list="scope.row.commentPic" style="width: 30px; height: 30px" preview-teleported hide-on-click-modal />
            </div>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="60" :formatter="formatter" />
        <el-table-column prop="nickName" label="用户昵称" width="100" />
        <el-table-column prop="anonymity" label="是否匿名" width="80" :formatter="formatter" />
        <el-table-column prop="auditRemark" label="审核拒绝原因" min-width="120" />
        <el-table-column prop="auditName" label="审核人" width="80" />
        <el-table-column prop="createTime" label="评价时间" width="160" />
        <el-table-column label="操作" fixed="right" width="60">
          <template #default="scope">
            <el-button v-has-perm="'T520'" v-if="scope.row.state === 1" type="primary" :icon="Hide" @click="handleAudit(scope.row)" link title="审核"></el-button>
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
  <EvaluationForm ref="formRef" @reload="getPage"></EvaluationForm>
</template>
<script setup>
import { listPageApi } from '@/api/service/evaluation';
import { Hide } from '@element-plus/icons-vue';
import usePermStore from '@/store/perm';
import { parseProductType } from '@/utils/common.js';
import EvaluationForm from '@/views/service/evaluation/EvaluationForm.vue';

const permStore = usePermStore();
const loading = ref(false);
const total = ref(0);
const formRef = ref();
const pageData = ref([]);
const selectAuth = permStore.hasAuth('L520');
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  queryType: null,
  state: null,
  productType: null,
  productId: null
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

const formatter = (row, column, cellValue) => {
  if (column.property === 'state') {
    switch (cellValue) {
      case 1:
        return '正常';
      case 2:
        return '屏蔽';
    }
  } else if (column.property === 'anonymity') {
    return cellValue ? '是' : '否';
  } else {
    const subTitle = row.subTitle;
    if (subTitle) {
      return cellValue + `（${subTitle}）`;
    }
    return cellValue;
  }
};

const handleAudit = (row) => {
  formRef.value.openDialog({ id: row.id });
};
</script>
