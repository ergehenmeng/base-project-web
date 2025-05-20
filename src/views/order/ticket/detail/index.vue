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
          <span>订单编号：</span><span>{{ data.orderNo }}<CopyLink :content="data.orderNo" /></span> <span>购买数量：</span
          ><span>{{ data.num }}</span> <span>单价：</span><span>{{ data.price }}</span> <span>订单联系人：</span><span>{{ data.mobile }}</span> <span>游玩日期：</span
          ><span>{{ data.visitDate }}</span> <span>下单时间：</span><span>{{ data.createTime }}</span>
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
          <span>门票信息</span>
        </div>
        <div class="content-nav">
          <span>景区名称：</span><span><el-link type="primary" :underline="false" @click="handleScenicDetail(data.scenicId)">{{ data.scenicName }}</el-link></span> <span>门票名称：</span><span><el-link type="primary" :underline="false" @click="handleDetail(data.ticketId)">{{ data.title }}</el-link>
          <el-popover placement="right" :width="400" trigger="hover" v-if="data.category === 7">
            <template #reference>
              <el-button type="primary" link><Question/></el-button>
            </template>
            <el-table :data="data.combineList">
              <el-table-column width="120" property="title" label="门票名称" />
              <el-table-column width="80" property="category" label="票种" :formatter="formatter"/>
              <el-table-column width="180" property="useTime" label="核销时间" />
            </el-table>
          </el-popover>

          </span><span>票种类型：</span
          ><span>{{ ticketType(data.category) }}</span>
          <span>是否实名：</span><span>{{ data.realBuy ? '是' : '否' }}</span> <span>备注信息：</span
          ><span
            ><span class="order-remark">{{ data.remark }}</span></span
          >
        </div>
      </div>
      <div class="right item" v-if="data.realBuy">
        <div class="header-nav">
          <span>游客信息</span>
        </div>
        <div class="content-nav visit-item">
          <el-table :data="data.visitorList" stripe show-overflow-tooltip max-height="250">
            <el-table-column prop="memberName" label="游客姓名" />
            <el-table-column prop="idCard" label="身份证号码" width="180" />
            <el-table-column prop="state" label="状态" :formatter="formatter" />
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
import { selectApi } from '@/api/order/ticket';
import { goBack } from '@/utils/common.js';
import { useRoute, useRouter } from 'vue-router';
import QuestionTip from '@/components/QuestionTip.vue';
import PayType from '@/components/PayType.vue';
import OrderAccountBar from '@/components/OrderAccountBar.vue';
import OrderStateBar from '@/components/OrderStateBar.vue';
import CopyLink from '@/components/CopyLink.vue'
import Question from '@/components/icon/Question.vue'

const loading = ref(false);
const route = useRoute();
const router = useRouter();
const data = ref({
  orderNo: '',
  scenicName: '',
  ticketId: null,
  title: '',
  payType: null,
  tradeNo: null,
  num: null,
  price: null,
  mobile: null,
  visitDate: null,
  state: 0,
  category: null,
  verificationType: null,
  refundState: 0,
  closeType: null,
  payAmount: "0",
  discountAmount: "0",
  useTime: null,
  completeTime: null,
  closeTime: null,
  payTime: null,
  createTime: null,
  realBuy: null,
  visitorList: [],
  combineList: [],
  remark: null
});

const formatter = (_row, column, cellValue) => {
  if (column.property === 'state') {
    if (cellValue === 0) {
      return '待支付';
    } else if (cellValue === 1) {
      return '待使用';
    } else if (cellValue === 2) {
      return '已使用';
    } else if (cellValue === 3) {
      return '退款中';
    } else {
      return '已退款';
    }
  } else if (column.property === 'category') {
    return formatCategory(cellValue);
  }
};

const formatCategory = (category) => {
  if (category === 1) {
    return '成人';
  } else if (category === 2) {
    return '老人';
  } else if (category === 3) {
    return '儿童';
  } else if (category === 4) {
    return '演出';
  } else if (category === 5) {
    return '活动';
  } else if (category === 6) {
    return '研学';
  } else if (category === 7) {
    return '套票';
  }
}

const handleDetail = (id) => {
  router.push('/product/ticket/detail/' + id);
};

const handleScenicDetail = (id) => {
  router.push('/product/scenic/detail/' + id);
};

const ticketType = computed(() => {
  return formatCategory;
})

onBeforeMount(() => {
  loading.value = true;
  selectApi({ orderNo: route.params.orderNo }).then((res) => {
    data.value = res.data;
  }).finally(() => {
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
