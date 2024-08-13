<template>
  <el-col :span="props.span" class="item-layout">
    <div class="item-block">
      <div class="item-icon">
        <slot></slot>
      </div>
      <div class="item-box">
        <el-statistic :value="amountRef" :title="props.title" :precision="props.precision"> </el-statistic>
      </div>
    </div>
  </el-col>
</template>
<script setup>
import { useTransition } from '@vueuse/core'

const props = defineProps({
  span: {
    type: Number,
    default: 6
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: [String, Number],
    default: 0
  },
  precision: {
    type: Number,
    default: 0
  }
});

const amount = ref(0);
const amountRef = useTransition(amount, {
  duration: 1000
});

watch(
  () => props.amount,
  (val) => {
    if (typeof val === 'string') {
      amount.value = Number(val);
    } else if (typeof val === 'number'){
      amount.value = val;
    }
  }
)

</script>
<style lang="scss" scoped>
.item-layout {
  padding: 10px;
  .item-block {
    border: 1px solid #eee;
    width: 100%;
    height: 100px;
    display: flex;
    padding: 20px;
    justify-content: left;
    align-items: center;
    .item-icon {
      width: 50px;
      height: 50px;
      margin-right: 15px;
    }
    .item-box {
      .item-box-title {
        color: #333333;
        font-size: 12px;
        display: block;
      }
      .item-box-content {
        color: #222;
        margin-top: 5px;
        font-size: 25px;
        display: block;
      }
    }
  }
}

</style>