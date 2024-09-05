<template>
  <div class="title-bar">
    <div class="bar-content">
      <span class="amount-item"><span>订单金额：<span>{{ props.amount }}</span> 元</span></span>
      <span class="amount-item" v-if="props.fee"><span>快递费：<span>{{ props.fee }}</span> 元</span></span>
      <span class="amount-item"><span>优惠金额：<span>{{ totalDiscount }}</span> 元<QuestionTip v-if="props.cdKeyAmount" content="优惠券优惠+兑换码优惠"></QuestionTip></span></span>
      <span class="amount-item"><span>实付金额：<span class="pay-amount">{{ props.payAmount }}</span> 元</span></span>
    </div>
  </div>
</template>

<script setup>
import Big from 'big.js'
import QuestionTip from '@/components/QuestionTip.vue'

const props = defineProps({
  payAmount: {
    required: true,
    type: String,
    default: ''
  },
  discountAmount: {
    type: String,
    default: null
  },
  cdKeyAmount: {
    type: String,
    default: null
  },
  fee: {
    type: String,
    default: null
  },
  amount: {
    required: true,
    type: String,
    default: ''
  }
})

const totalDiscount = computed(() => {
  let discount = new Big(0);
  if (props.discountAmount) {
    discount = new Big(props.discountAmount);
  }
  let cdKey = new Big(0);
  if (props.cdKeyAmount) {
    cdKey = new Big(props.cdKeyAmount);
  }
  return discount.plus(cdKey).toFixed(2);
})

</script>

<style lang="scss" scoped>
.title-bar {
  margin-top: 20px;
  height: 50px;
  background-color: #eee;
  border-radius: 3px;
  padding-left: 20px;
  line-height: 50px;
  font-size: 16px;
  color: #222;
  position: relative;
  .bar-content {
    float: right;
    padding-right: 20px;
    .amount-item {
      margin-left: 20px;
      .pay-amount {
        color: #f56c6c;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}

</style>