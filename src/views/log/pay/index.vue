<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="订单编号、交易单号、退款单号" clearable @keyup.enter="search" style="width: 300px" maxlength="30" />
        </el-form-item>
        <el-form-item label="请求类型">
          <el-select v-model="queryParams.stepType" clearable class="w110">
            <el-option label="支付" value="PAY" />
            <el-option label="退款" value="REFUND" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付渠道">
          <el-select v-model="queryParams.payChannel" clearable class="w110">
            <el-option label="微信" value="WECHAT" />
            <el-option label="支付宝" value="ALIPAY" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-tabs v-model="activeTab" @tab-change="handleChange">
        <el-tab-pane label="同步日志" name="sync">
          <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
            <el-table-column prop="payChannel" label="支付渠道" :formatter="formatter" width="100" />
            <el-table-column prop="orderNo" label="订单编号" width="220" />
            <el-table-column prop="stepType" label="请求类型" :formatter="formatter" width="120" />
            <el-table-column prop="tradeNo" label="交易流水号" width="220" />
            <el-table-column prop="refundNo" label="退款流水号" width="220" />
            <el-table-column prop="requestBody" label="请求参数" min-width="250" />
            <el-table-column prop="responseBody" label="响应参数" width="250" />
            <el-table-column prop="createTime" label="请求时间" width="180" />
          </el-table>
          <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[10, 20, 50]"
            layout="->, total, sizes, prev, pager, next"
            :total="total"
            @change="getPage"
          />
        </el-tab-pane>
        <el-tab-pane label="异步日志" name="async">
          <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
            <el-table-column prop="payChannel" label="支付方式" :formatter="formatter" width="100" />
            <el-table-column prop="notifyId" label="异步通知ID" width="220" />
            <el-table-column prop="stepType" label="通知类型" :formatter="formatter" width="150"/>
            <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
            <el-table-column prop="tradeNo" label="交易流水号" width="220" />
            <el-table-column prop="refundNo" label="退款流水号" width="220" />
            <el-table-column prop="params" label="通知原始参数" min-width="250" />
            <el-table-column prop="createTime" label="请求时间" width="180"/>
            <el-table-column label="操作" fixed="right" width="100">
              <template #default="scope">
                <el-button v-has-perm="'UF00'" v-if="scope.row.state === 0" @click="handlePlayback(scope.row)" link title="回调重新执行">
                  <Playback/>
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <ContentDialog ref="contentRef"></ContentDialog>
</template>
<script setup>
import { asyncPageApi, syncPageApi, playbackApi } from '@/api/log/pay';
import useUserStore from '@/store/user';
import ContentDialog from '@/components/ContentDialog.vue';
import Playback from '@/components/icon/Playback.vue'
import { confirmMsg, successMsg } from '@/utils/message.js'

const userStore = useUserStore();
const syncAuth = userStore.hasAuth('5F00');
const asyncAuth = userStore.hasAuth('ZF00');
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const contentRef = ref();
const activeTab = ref('sync');

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  stepType: null,
  payChannel: null
});

const getPage = async () => {
  loading.value = true;
  try {
    pageData.value = [];
    total.value = 0;
    if (activeTab.value === 'sync') {
      if (syncAuth) {
        const { data } = await syncPageApi(queryParams);
        pageData.value = data.rows;
        total.value = data.total;
      }
    } else if (asyncAuth) {
      const { data } = await asyncPageApi(queryParams);
      pageData.value = data.rows;
      total.value = data.total;
    }
  } finally {
    loading.value = false;
  }
};

const handlePlayback = (row) => {
  confirmMsg('开始模拟第三方回调, 确定要执行吗?', () => {
    const data = { id: row.id };
    playbackApi(data).then(() => {
      successMsg('回放执行成功');
      getPage();
    });
  });
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'payChannel') {
    return cellValue === 'WECHAT' ? '微信' : '支付宝';
  } else if (column.property === 'stepType') {
    return cellValue === 'PAY' ? '支付' : '退款';
  } else if (column.property === 'state') {
    return cellValue === 0 ? '未回放' : h('span', { style: 'color: green;' }, '回放成功');
  } else {
    return cellValue;
  }
};

const handleChange = (tab) => {
  queryParams.page = 1;
  activeTab.value = tab;
  getPage();
};

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  getPage();
});
</script>
