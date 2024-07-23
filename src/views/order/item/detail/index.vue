<template>
  <div class="detail-content">
    <el-divider />
    <OrderStateBar :state="data.state" :refund-state="data.refundState"></OrderStateBar>
    <div v-loading="loading">
      <div class="order-content">
        <div class="left item">
          <div class="header-nav">
            <span>订单信息</span>
          </div>
          <div class="content-nav">
            <span>订单编号：</span><span>{{ data.orderNo }}<el-button v-if="isSupported" :icon="DocumentCopy" @click="copyClipboard(data.orderNo)" link></el-button></span>
            <span>店铺名称：</span><span>{{ data.storeName }}</span>
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
            <span>买家信息</span>
          </div>
          <div class="content-nav">
            <span>昵称：</span><span> {{ data.nickName }}</span>
            <span>手机号：</span><span> {{ data.mobile }}</span>
            <span>收货地址：</span><span>{{ data.detailAddress }} <el-button v-if="isSupported" :icon="DocumentCopy" @click="copyClipboard(data.detailAddress)" link></el-button> </span>
            <span>备注信息：</span><span><span class="order-remark">{{ data.remark }}</span></span>
          </div>
        </div>
        <div class="right item">
          <div class="header-nav">
            <span>订单总计</span>
          </div>
          <div class="content-nav visit-item">
            <span>订单金额：</span><span>{{ data.amount }} 元</span>
            <span>快递费：</span><span>{{ data.fee }} 元</span>
            <span>优惠金额：</span><span>{{ data.discountAmount }} 元</span>
            <span>实付金额：</span><span><span class="pay-amount"> {{ data.payAmount }}</span> 元</span>
          </div>
        </div>
      </div>
      <div class="item-content">
        <div class="header-nav">
          <span>商品信息</span>
        </div>
        <div class="content-nav">
          <div class="item-list">
            <el-table :data="data.itemList" @selection-change="handleSelected" max-height="300">
              <el-table-column type="selection" width="50" >
              </el-table-column>
              <el-table-column label="图片" prop="coverUrl" width="80">
                <template #default="scope">
                  <div style="display: flex; align-items: center">
                    <el-image fit="contain" :src="scope.row.coverUrl" style="width: 50px; height: 50px" :preview-src-list="scope.row.coverUrl?.split(',')" preview-teleported hide-on-click-modal />
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="title" min-width="150"></el-table-column>
              <el-table-column label="规格名称" prop="skuTitle" width="120" :formatter="formatter"></el-table-column>
              <el-table-column label="购买数量" prop="num" width="100"></el-table-column>
              <el-table-column label="单价" prop="salePrice" width="100"></el-table-column>
              <el-table-column label="退款状态" prop="refundState" width="100" :formatter="formatter"></el-table-column>
              <el-table-column label="配送状态" prop="deliveryState" width="100" :formatter="formatter" ></el-table-column>
              <el-table-column width="80" >
                <template #header>
                  <el-button type="primary" size="small" :disabled="selected.length === 0">发货</el-button>
                </template>
                <template #default="scope">
                  <el-button type="primary" @click="handleUpdatePrice(scope.row)" :icon="Edit" link title="改价"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="delivery-content">
        <div class="header-nav">
          <span>发货信息</span>
        </div>
        <div class="content-nav">
          <div v-for="item in data.shippedList" :key="item.id">
            <div class="delivery-item">
              <div class="package-content item">
                <span>物流公司：</span><span> {{ formatExpressType(item.expressCode) }}</span>
                <span>物流单号：</span><span> {{ item.expressNo }} <el-button :icon="EditPen" type="primary" link title="修改单号"></el-button></span>
                <span>包含商品：</span>
                <div>
                  水电费水电费水电费是的水电费水电费第三方
                </div>
              </div>
              <div class="logistics-content item">

              </div>
            </div>
            <el-divider />
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="edit-button-footer">
        <el-button @click="goBack($router)">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { selectApi } from '@/api/order/item';
import { formatExpressType, goBack } from '@/utils/common.js'
import { useRoute } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { useClipboard } from '@vueuse/core';
import { DocumentCopy, Edit, EditPen } from '@element-plus/icons-vue'
import QuestionTip from '@/components/QuestionTip.vue';
import PayType from '@/components/PayType.vue';
import OrderStateBar from '@/components/OrderStateBar.vue';
import Price from '@/components/icon/Price.vue'

const { copy, isSupported } = useClipboard();
const loading = ref(false);
const route = useRoute();
const selected = ref([]);
const data = ref({
  orderNo: '',
  storeName: '',
  title: '',
  payType: null,
  tradeNo: null,
  nickName: '',
  mobile: null,
  detailAddress: null,
  state: 0,
  refundState: 0,
  closeType: null,
  payAmount: '0',
  discountAmount: '0',
  refundAmount: null,
  completeTime: null,
  closeTime: null,
  payTime: null,
  createTime: null,
  itemList: [],
  shippedList: [],
  adjustList: [],
  remark: null
});

const copyClipboard = (value) => {
  copy(value);
  successMsg('复制成功');
};

const handleSelected = (val) => {
  selected.value = val.map((item) => item.cacheName);
};

const handleUpdatePrice = (row) => {
  console.log(row);
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'skuTitle') {
    return cellValue ? cellValue : '无';
  } else if (column.property === 'deliveryState') {
    switch (cellValue) {
      case 1:
        return '待发货';
      case 2:
        return '待收货';
      case 3:
        return '待自提';
      case 4:
        return '已签收';
      case 5:
        return '已退款';
      default:
        return '';
    }
  } else if (column.property === 'refundState') {
    switch (cellValue) {
      case 1:
        return '已退款';
      default:
        return '';
    }
  }
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
.order-content  {
  margin-top: 20px;
  display: flex;
  font-size: 14px;

  .right, .middle, .left {
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
      padding-left: 30px;
      flex: 1;
    }
  }

  .visit-item {
    font-size: 16px;
    line-height: 19px;
    .pay-amount {
      color: #f56c6c;
      font-size: 20px;
      font-weight: bold;
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

.item-content, .delivery-content {
  margin-top: 20px;
  font-size: 14px;
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
    margin: 10px;
    .item-list {
      width: 990px;
      padding-right: 50px;
      border-right: 1px solid #e6e6e6;
    }
  }
}

.delivery-content {
  margin-top: 20px;
  font-size: 14px;
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
    margin: 10px;
    .delivery-item {
      display: flex;
      .item {
        flex: 1;
      }
      .item:first-child {
        border-right: 1px solid #e6e6e6;
      }
      .package-content {
        padding-top: 10px;
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
      }
    }
  }
}
</style>
