<template>
  <el-col :span="props.span" class="item-layout">
    <div class="item-block">
      <div class="item-icon">
        <slot></slot>
      </div>
      <div class="item-box">
        <span class="item-box-title">{{ props.title}}</span>
        <span class="item-box-content">{{ props.amount }}</span>
      </div>
    </div>
  </el-col>
</template>
<script setup>
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
    type: String,
    required: true
  }
});
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