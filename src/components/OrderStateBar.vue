<template>
  <div class="title-bar">
    <span class="bar-state">订单状态：<span v-bind:style="formatStyle()">{{ orderStateFormat(props.state) }}</span></span>
    <span class="bar-refund-state" v-if="props.state === 6">退款状态：{{ refundStateFormat(props.refundState) }}</span>
  </div>
</template>

<script setup>
import { orderStateFormat, refundStateFormat } from '../utils/common.js'

const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  state: {
    required: true,
    type: Number,
    default: null
  },
  refundState: {
    type: Number,
    default: null
  }
})

const formatStyle = () => {
  if (props.state === 7) {
    return {
      color: '#1abc9c'
    }
  } else if (props.state === 10 || props.state === 11){
    return {
      color: '#ff4757'
    }
  } else if (props.state === 2 || props.state === 3 || props.state === 4 || props.state === 5 || props.state === 6){
    return {
      color: '#1e90ff'
    }
  } else if (props.state === 8) {
    return {
      color: '#747d8c'
    }
  } else {
    return {}
  }

}

</script>

<style lang="scss" scoped>
.title-bar {
  height: 50px;
  background-color: #eee;
  border-radius: 3px;
  padding: 0 40px;
  line-height: 50px;
  font-size: 20px;
  font-weight: bold;
  color: #000;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.bar-state::before {
  content: '';
  display: inline-block;
  width: 4px;
  position: absolute;
  height: 22px;
  top: 14px;
  left: 30px;
  background-color: #409eff;
  vertical-align: middle;
}
</style>