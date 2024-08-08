<template>
  <el-col :span="props.span" class="item-layout">
    <div class="item-card" :style="{ height: props.height + 'px'}">
      <div class="item-header">
        <div class="item-title">
          <span class="item-icon" >
            <template v-if="$slots.icon">
              <slot name="icon"></slot>
            </template>
            <template v-else>
              <UserList />
            </template>
          </span>
          <span>{{props.title}}</span>
        </div>
        <div class="item-action">
          <slot name="action"></slot>
        </div>
      </div>
      <div class="item-content">
        <slot name="content"></slot>
      </div>
    </div>
  </el-col>
</template>
<script setup>
import UserList from '@/components/icon/UserList.vue'

const props = defineProps({
  span: {
    type: Number,
    default: 12
  },
  title: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    default: 250
  }
});
</script>
<style lang="scss" scoped>
.item-card {
  box-sizing: border-box;
  border: 1px solid #eee;
  width: 100%;
  .item-header {
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    padding: 10px;
    height: 50px;
    border-bottom: 1px solid #eee;
    .item-title {
      font-weight: bold;
      font-size: 15px;
      color: #333333;
      height: 30px;
      line-height: 30px;
      display: flex;
      .item-icon {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .item-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 50px);
    span {
      font-weight: 600;
      color: #333;
      font-size: 30px;
    }
  }
}

</style>