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
          <span>订单编号：</span><span>{{ data.orderNo }}<CopyLink :content="data.orderNo" /></span> <span>房间数量：</span
          ><span>{{ data.num }} 间</span> <span>单价：</span><span>{{ data.price }}<QuestionTip content="按住离时间计算每间房的价格"></QuestionTip></span> <span>订单联系人：</span
          ><span>{{ data.mobile }}</span> <span>住离日期：</span
          ><span
            >{{ data.startDate }}~{{ data.endDate }} 共计 <span style="color: #1e90ff; font-size: 16px; font-weight: bold;">{{ data.days }}</span> 天</span
          >
          <span>下单时间：</span><span>{{ data.createTime }}</span>
          <template v-if="data.cdKey">
            <span>兑换码：</span><span>{{ data.cdKey }}</span>
          </template>
          <template v-if="data.tradeNo">
            <span>支付方式：</span><span><PayType :pay-type="data.payType"></PayType></span>
          </template>
          <template v-if="data.tradeNo">
            <span>支付流水号：</span><span>{{ data.tradeNo }}<CopyLink :content="data.tradeNo"/></span>
          </template>
          <template v-if="data.payTime">
            <span>支付时间：</span><span>{{ data.payTime }}</span>
          </template>
          <template v-if="data.state > 1 ">
            <span>确认状态：</span><span>{{ formatConfirmState(data.confirmState) }}</span>
          </template>
          <template v-if="data.state > 1 && data.confirmState === 2">
            <span>确认备注：</span><span>{{ data.confirmRemark }}</span>
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
          <span>民宿信息</span>
        </div>
        <div class="content-nav">
          <span>民宿名称：</span><span>{{ data.homestayName }}</span> <span>房型名称：</span><span>{{ data.title }}</span> <span>备注信息：</span
          ><span
            ><span class="order-remark">{{ data.remark }}</span></span
          >
        </div>
      </div>
      <div class="right item">
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
    <OrderAccountBar :pay-amount="data.payAmount" :amount="data.payAmount" :discount-amount="data.discountAmount" :cd-key-amount="data.cdKeyAmount"/>
    <div>
      <div class="edit-button-footer">
        <el-button @click="goBack($router)">返回</el-button>
        <el-button v-has-perm="'caD0'" v-if="data.state === 2 && data.confirmState === 0" type="primary" @click="handleYesConfirm">确认有房</el-button>
        <el-button v-has-perm="'caD0'" v-if="data.state === 2 && data.confirmState === 0" type="warning" @click="handleNoConfirm">确认无房</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { selectApi, confirmApi } from '@/api/order/homestay';
import { goBack, renderMsg } from '@/utils/common.js'
import { useRoute, useRouter } from 'vue-router';
import { confirmMsg, successMsg } from '@/utils/message.js'
import QuestionTip from '@/components/QuestionTip.vue';
import PayType from '@/components/PayType.vue';
import OrderAccountBar from '@/components/OrderAccountBar.vue';
import OrderStateBar from '@/components/OrderStateBar.vue';
import dayjs from 'dayjs';
import CopyLink from '@/components/CopyLink.vue'

const loading = ref(false);
const route = useRoute();
const router = useRouter();
const data = ref({
  orderNo: '',
  homestayName: '',
  title: '',
  payType: null,
  tradeNo: null,
  num: null,
  price: null,
  mobile: null,
  startDate: null,
  endDate: null,
  state: 0,
  refundState: 0,
  closeType: null,
  payAmount: '0',
  discountAmount: '0',
  completeTime: null,
  cdKey: null,
  cdKeyAmount: '0',
  closeTime: null,
  payTime: null,
  createTime: null,
  visitorList: [],
  remark: null,
  confirmState: 0,
  confirmRemark: null,
  days: 1
});

const formatter = (_row, column, cellValue) => {
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
};

const formatConfirmState = (state) => {
  if (state === 0) {
    return '待确认';
  } else if (state === 1) {
    return '确认有房';
  } else if (state === 2) {
    return '确认无房';
  } else if (state === 3) {
    return '自动确认有房';
  } else {
    return '';
  }
}

const handleYesConfirm = () => {
  const msg  = renderMsg(["你的民宿确定有", () => data.value.title, "吗？"])
  confirmMsg(msg, () => {
    confirmApi({ orderNo: route.params.orderNo, confirmState: 1 }).then(() => {
      successMsg('确认成功');
      router.go(0);
    });
  })
};

const handleNoConfirm = () => {
  const msg  = renderMsg(["你的民宿确定没有", () => data.value.title, "了吗？"])
  ElMessageBox.prompt(msg, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPlaceholder: '备注信息',
    inputErrorMessage: '备注信息不为空且小于50个字符',
    inputValidator: (str) => {
      return str !== '' && str !== null && str !== undefined && str.length <= 50;
    }
  }).then(({value}) => {
    confirmApi({ orderNo: route.params.orderNo, confirmState: 2, remark: value }).then(() => {
      successMsg('确认成功');
      router.go(0);
    }).catch(() => {
    });
  });
};

onBeforeMount(() => {
  loading.value = true;
  selectApi({ orderNo: route.params.orderNo }).then((res) => {
    data.value = res.data;
    data.value.days = dayjs(data.value.endDate).diff(dayjs(data.value.startDate), 'day');
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
