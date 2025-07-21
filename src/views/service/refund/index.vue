<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="订单编号" clearable @keyup.enter="search" maxlength="30" class="w220" />
        </el-form-item>
        <el-form-item label="退款状态">
          <el-select v-model="queryParams.state" clearable class="w120" >
            <el-option label="退款中" :value="0" />
            <el-option label="退款成功" :value="1" />
            <el-option label="退款失败" :value="2" />
            <el-option label="取消退款" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="queryParams.auditState" clearable class="w120" >
            <el-option label="待审核" :value="0" />
            <el-option label="审核通过" :value="1" />
            <el-option label="审核拒绝" :value="2" />
            <el-option label="取消审核" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期">
          <div class="w220">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="activityDate" class="w220"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-tabs v-model="activeName" @tab-change="handleChange">
        <el-tab-pane v-for="config in typeList" :label="config.name" :key="config.prefix" :name="config.prefix">
          <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
            <el-table-column prop="title" label="商品名称" min-width="150" />
            <el-table-column prop="orderNo" label="订单编号" width="200" />
            <el-table-column prop="state" label="退款状态" width="90" :formatter="formatter"/>
            <el-table-column prop="auditState" label="审核状态" width="90" :formatter="formatter"/>
            <el-table-column prop="num" label="退款数量" width="80" />
            <el-table-column prop="refundAmount" width="150" >
              <template #header>
                <span>申请退款金额<QuestionTip v-if="activeName === 'LS'" content="注意：含快递费"></QuestionTip></span>
              </template>
            </el-table-column>
            <el-table-column prop="expressFee" label="退款快递费" width="100" v-if="activeName === 'LS'"/>
            <el-table-column prop="scoreAmount" label="退款积分" width="80" v-if="activeName === 'LS'"/>
            <el-table-column prop="reason" label="退款原因" min-width="100" />
            <el-table-column prop="applyTime" label="申请时间" width="180" />
            <el-table-column prop="auditTime" label="审核时间" width="180" />
            <el-table-column label="操作" width="100" >
              <template #default="scope">
                <el-button v-has-perm="'Xt20'" :icon="Document" @click="handleDetail(scope.row.orderNo)" link title="详情"></el-button>
                <el-button v-has-perm="'ht20'" v-show="scope.row.auditState === 0" @click="handleAudit(scope.row)" link title="退款审核">
                  <Audit></Audit>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
  <AuditForm ref="formRef" @reload="getPage"></AuditForm>
</template>
<script setup>
import { listPageApi } from '@/api/service/refund';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import QuestionTip from '@/components/QuestionTip.vue'
import { Document } from '@element-plus/icons-vue'
import Audit from '@/components/icon/Audit.vue'
import { errorMsg } from '@/utils/message.js'
import AuditForm from '@/views/service/refund/AuditForm.vue'

const formRef = ref();
const activeName = ref('');
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('pt20');
const typeList = ref([]);

const loadPrefix = () => {
  const merchantType = userStore.user.merchantType
  if (merchantType === 0 || (merchantType & 1) === 1) {
    typeList.value.push({ prefix: 'MP', name: '门票'});
  }
  if (merchantType === 0 || (merchantType & 2) === 2) {
    typeList.value.push({ prefix: 'MS', name: '民宿'});
  }
  if (merchantType === 0 || (merchantType & 4) === 4) {
    typeList.value.push({ prefix: 'CY', name: '餐饮券'});
  }
  if (merchantType === 0 || (merchantType & 8) === 8) {
    typeList.value.push({ prefix: 'LS', name: '零售'});
  }
  if (merchantType === 0 || (merchantType & 16) === 16) {
    typeList.value.push({ prefix: 'XL', name: '线路'});
  }
  if (merchantType === 0 || (merchantType & 32) === 32) {
    typeList.value.push({ prefix: 'YY', name: '场馆'});
  }
}
const activityDate = ref([])
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  prefix: '',
  auditState: null,
  startDate: null,
  endDate: null
});

const handleChange = (name) => {
  queryParams.prefix = name;
  getPage();
};

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      if (activityDate.value.length === 2) {
        queryParams.startDate = activityDate.value[0];
        queryParams.endDate = activityDate.value[1];
      } else {
        queryParams.startDate = null;
        queryParams.endDate = null;
      }
      const { data } = await listPageApi(queryParams);
      pageData.value = data.rows;
      total.value = data.total;
    }
  } finally {
    loading.value = false;
  }
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'state') {
    switch (cellValue) {
      case 0:
        return '退款中';
      case 1:
        return '退款成功';
      case 2:
        return '退款失败';
      default:
        return '取消退款';
    }
  } else if (column.property === 'auditState') {
    switch (cellValue) {
      case 0:
        return '待审核';
      case 1:
        return '审核通过';
      case 2:
        return '审核拒绝';
      default:
        return '取消审核';
    }
  } else {
    return cellValue;
  }
};

const handleDetail = (_orderNo) => {
  errorMsg('暂未开放');
};

const handleAudit = (row) => {
  formRef.value.openDialog(row);
};

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  loadPrefix();
  activeName.value = typeList.value[0].prefix;
  queryParams.prefix = typeList.value[0].prefix;
  getPage();
});


</script>
