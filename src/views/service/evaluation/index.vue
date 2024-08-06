<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="订单编号" clearable @keyup.enter="search" maxlength="30"/>
        </el-form-item>
        <el-form-item label="评价状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="待审核" :value="0" />
            <el-option label="审核通过" :value="1" />
            <el-option label="审核拒绝" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="queryParams.productType" clearable >
            <el-option label="零售" value="item" />
            <el-option label="门票" value="ticket" />
            <el-option label="民宿" value="homestay" />
            <el-option label="餐饮" value="voucher" />
            <el-option label="场馆" value="venue" />
            <el-option label="线路" value="line" />
          </el-select>
        </el-form-item>
        <el-form-item label="评价类型">
          <el-select v-model="queryParams.queryType" clearable >
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
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="orderNo" label="商品图片" width="100" >
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
        <el-table-column prop="productTitle" label="商品名称" min-width="200" :formatter="formatter"/>
        <el-table-column prop="productType" label="商品类型" width="100" :formatter="(row, column, cellValue) => parseProductType(cellValue)"/>
        <el-table-column prop="orderNo" label="订单编号" width="180" />
        <el-table-column prop="score" label="综合评分" width="100" />
        <el-table-column prop="storeScore" label="店铺评分" width="100" />
        <el-table-column prop="comment" label="评论" width="150" />
        <el-table-column prop="commentPic" label="评论图片" width="100" >
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                fit="cover"
                :src="scope.row.commentPic?.split(',')[0]"
                :preview-src-list="scope.row.commentPic?.split(',')"
                style="width: 30px; height: 30px"
                preview-teleported
                hide-on-click-modal
              />
           </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="审核状态" width="100" :formatter="formatter"/>
        <el-table-column prop="nickName" label="用户昵称" width="120" />
        <el-table-column prop="anonymity" label="是否匿名" width="120" :formatter="formatter"/>
        <el-table-column prop="auditRemark" label="审核拒绝原因" min-width="150" />
        <el-table-column prop="auditName" label="审核人" min-width="150" />
        <el-table-column prop="createTime" label="评价时间" width="180" />
        <el-table-column label="操作" fixed="right" width="80">
          <template #default="scope">
            <el-button v-has-perm="'T520'" v-if="scope.row.state === 0" type="primary" :icon="Coordinate" @click="handleAudit(scope.row)" link title="审核"></el-button>
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
  <EvaluationForm ref="formRef" @reload="getPage"></EvaluationForm>
</template>
<script setup>
import { listPageApi } from '@/api/service/evaluation';
import { Coordinate } from '@element-plus/icons-vue'
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import { parseProductType } from '@/utils/common.js'
import EvaluationForm from '@/views/service/evaluation/EvaluationForm.vue'

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const formRef = ref();
const pageData = ref([]);
const selectAuth = userStore.hasAuth('L520');
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
      case 0:
        return '待审核';
      case 1:
        return '审核通过';
      case 2:
        return '审核拒绝';
    }
  } else if (column.property === 'anonymity') {
    return cellValue ? '是' : '否';
  } else {
    const subTitle = row.subTitle;
    if (subTitle) {
      return cellValue + `（${subTitle}）`
    }
    return cellValue;
  }
}

const handleAudit = (row) => {
  formRef.value.openDialog({id: row.id})
}

</script>
