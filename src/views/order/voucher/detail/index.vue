<template>
  <div class="detail-content">
    <el-divider />
    <OrderStateBar :state="data.state" :refund-state="data.refundState"></OrderStateBar>
    <div class="order-content" v-loading="loading">
      <div class="left item">
        <div class="header-nav">
          <span>订单信息</span>
        </div>
        <div class="content-nav">
          <span>订单编号：</span><span>{{ data.orderNo }}<el-button v-if="isSupported" :icon="DocumentCopy" @click="copyClipboard(data.orderNo)" link></el-button></span>
          <span>购买数量：</span><span>{{ data.num }}</span>
          <span>已使用：</span><span>{{ data.useNum }}</span>
          <span>订单联系人：</span><span> {{ data.nickName }}-{{ data.mobile }}</span>
          <span>游玩日期：</span><span>{{ data.visitDate }}</span>
          <span>下单时间：</span><span>{{ data.createTime }}</span>
          <template v-if="data.tradeNo">
            <span>支付方式：</span><span><PayType :pay-type="data.payType"></PayType></span>
          </template>
          <template v-if="data.tradeNo">
            <span>支付流水号：</span><span>{{ data.tradeNo }}<el-button v-if="isSupported" :icon="DocumentCopy" @click="copyClipboard(data.tradeNo)" link></el-button></span>
          </template>
          <template v-if="data.payTime">
            <span>支付时间：</span><span>{{ data.payTime }}</span>
          </template>
          <template v-if="data.state === 9">
            <span>关闭时间：</span><span>{{ data.closeTime }}<QuestionTip :content="data.closeType === 1 ? '过期自动关闭' : data.closeType === 2 ? '用户取消' : '退款完成'"></QuestionTip></span>
          </template>
          <template v-if="data.useTime">
            <span>核销时间：</span><span>{{ data.useTime }}</span>
          </template>
          <template v-if="data.completeTime">
            <span>完成时间：</span><span>{{ data.completeTime }}</span>
          </template>
        </div>
      </div>
      <div class="middle item">
        <div class="header-nav">
          <span>餐饮券信息</span>
        </div>
        <div class="content-nav">
          <span>场地名称：</span><span>{{ data.siteTitle }}</span> <span>场馆名称：</span><span>{{ data.title }}</span> <span>场馆类型：</span><span>{{ venueTypeFormat(data.venueType) }}</span>
          <span>备注信息：</span
          ><span
        ><span class="order-remark">{{ data.remark }}</span></span
        >
        </div>
      </div>
      <div class="right item">
        <div class="header-nav">
          <span>预约信息</span>
        </div>
        <div class="content-nav visit-item">
          <el-table :data="data.phaseList" stripe show-overflow-tooltip max-height="250">
            <el-table-column prop="startTime" label="预约时间段" min-width="200" :formatter="formatter" />
            <el-table-column prop="price" label="价格" min-width="150" />
          </el-table>
        </div>
      </div>
    </div>
    <OrderAccountBar :pay-amount="data.payAmount" :amount="data.payAmount" :discount-amount="data.discountAmount" />
    <div>
      <div class="edit-button-footer">
        <el-button @click="goBack($router)">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { selectApi } from '@/api/order/voucher';
import { goBack, venueTypeFormat } from '@/utils/common.js';
import { useRoute } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { useClipboard } from '@vueuse/core';
import { DocumentCopy } from '@element-plus/icons-vue';
import QuestionTip from '@/components/QuestionTip.vue';
import PayType from '@/components/PayType.vue';
import OrderAccountBar from '@/components/OrderAccountBar.vue';
import OrderStateBar from '@/components/OrderStateBar.vue';

const { copy, isSupported } = useClipboard();
const loading = ref(false);
const route = useRoute();
const data = ref({
  orderNo: '',
  restaurantName: '',
  title: '',
  venueType: null,
  payType: null,
  num: null,
  useNum: null,
  validDays: null,
  effectDate: null,
  expireDate: null,
  effectTime: null,
  expireTime: null,
  tradeNo: null,
  nickName: '',
  mobile: null,
  visitDate: null,
  state: 0,
  refundState: 0,
  closeType: null,
  payAmount: '0',
  discountAmount: '0',
  useTime: null,
  refundAmount: null,
  completeTime: null,
  closeTime: null,
  payTime: null,
  createTime: null,
  remark: null
});

const copyClipboard = (value) => {
  copy(value);
  successMsg('复制成功');
};

const formatter = (row, column, cellValue) => {
  return cellValue + '~' + row.endTime;
};

onBeforeMount(() => {
  loading.value = true;
  selectApi({ orderNo: route.params.orderNo })
    .then((res) => {
      data.value = res.data;
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>

<style lang="scss" scoped>
.order-content {
  margin-top: 20px;
  display: flex;
  font-size: 14px;

  .right,
  .left,
  .middle {
    flex: 1;
  }

  .item {
    border-right: 1px solid #e6e6e6;
  }

  .item:last-child {
    border-right: none;
  }

  .visit-item {
    padding: 15px 20px;
  }

  .header-nav {
    font-size: 14px;
    font-weight: bold;
    background-color: #eeeeee;
    display: flex;
    padding: 10px;

    span {
      padding-left: 30px;
      flex: 1;
    }
  }

  .content-nav {
    display: flex;
    flex-wrap: wrap;

    span {
      margin-top: 15px;
    }

    span:nth-child(2n + 1) {
      flex: 20%;
      text-align: right;
    }

    span:nth-child(2n) {
      flex: 80%;
      line-height: 19px;
    }

    .order-remark {
      margin-top: 0;
      width: 300px;
      display: inline-block;
      text-align: left !important;
      word-break: break-word;
      overflow-wrap: break-word;
    }
  }
}
</style>
