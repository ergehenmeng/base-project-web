<template>
  <div class="title-bar">
    <span class="bar-state">订单状态：<span v-bind:style="formatStyle()">{{ orderStateFormatNotStyle(props.state) }} </span> <span class="refund-state" v-if="props.refundState !== 0"> / {{ refundStateFormat(props.refundState) }}</span></span>
  </div>
</template>

<script setup>
import { orderStateFormatNotStyle, refundStateFormat } from '../utils/common.js'

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
      color: '#00a8ff'
    }
  } else if (props.state === 9 || props.state === 10){
    return {
      color: '#ff4757'
    }
  } else if (props.state === 2 || props.state === 3 || props.state === 4 ){
    return {
      color: '#ffa502'
    }
  } else if (props.state === 5) {
    return {
      color: '#00b894'
    }
  } else if (props.state === 6) {
    return {
      color: '#ff6b81'
    }
  } else if (props.state === 8) {
    return {
      color: '#747d8c'
    }
  } else if (props.state === 11){
    return {
      color: '#6ab04c'
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
.refund-state {
  color: #747d8c;
}
</style>