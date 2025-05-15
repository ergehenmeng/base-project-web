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
          <span>订单编号：</span><span>{{ data.orderNo }}<CopyLink :content="data.orderNo"/></span>
          <span>购买数量：</span><span>{{ data.num }} 张</span>
          <span>已核销：</span><span>{{ data.useNum }} 张</span>
          <span>订单联系人：</span><span> {{ data.nickName }}-{{ data.mobile }}</span>
          <span>使用日期：</span><span v-if="data.validDays > 0">购买之日起 {{ data.validDays }} 天有效</span>
          <span v-else>{{ data.effectDate }} ~ {{ data.expireDate }}</span>
          <span>使用时间：</span><span> {{ data.effectTime }} ~ {{ data.expireTime }}</span>
          <template v-if="data.cdKey">
            <span>兑换码：</span><span>{{ data.cdKey }}</span>
          </template>
          <span>下单时间：</span><span>{{ data.createTime }}</span>
          <template v-if="data.tradeNo">
            <span>支付方式：</span><span><PayType :pay-type="data.payType"></PayType></span>
          </template>
          <template v-if="data.tradeNo">
            <span>支付流水号：</span><span>{{ data.tradeNo }}<CopyLink :content="data.tradeNo"/></span>
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
          <span>餐饮券名称：</span><span>{{ data.title }}</span>
          <span>餐饮店铺：</span><span>{{ data.restaurantName }}</span>
          <span>备注信息：</span><span><span class="order-remark">{{ data.remark }}</span></span>
        </div>
      </div>
    </div>
    <OrderAccountBar :pay-amount="data.payAmount" :amount="data.payAmount" :discount-amount="data.discountAmount" :cd-key-amount="data.cdKeyAmount"/>
    <div>
      <div class="edit-button-footer">
        <el-button @click="goBack($router)">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { selectApi } from '@/api/order/voucher';
import { goBack } from '@/utils/common.js';
import { useRoute } from 'vue-router';
import QuestionTip from '@/components/QuestionTip.vue';
import PayType from '@/components/PayType.vue';
import OrderAccountBar from '@/components/OrderAccountBar.vue';
import OrderStateBar from '@/components/OrderStateBar.vue';
import CopyLink from '@/components/CopyLink.vue'

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
  state: 0,
  refundState: 0,
  closeType: null,
  payAmount: '0',
  discountAmount: '0',
  cdKey: null,
  cdKeyAmount: '0',
  useTime: null,
  refundAmount: null,
  completeTime: null,
  closeTime: null,
  payTime: null,
  createTime: null,
  remark: null
});

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

  .header-nav {
    font-size: 14px;
    font-weight: bold;
    background-color: #eeeeee;
    display: flex;
    padding: 10px;

    span {
      padding-left: 20px;
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
      flex: 15%;
      text-align: right;
    }

    span:nth-child(2n) {
      flex: 85%;
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
