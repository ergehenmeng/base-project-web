<template>
  <div class="title-bar" :style="{ width: props.width}">
    <span class="bar-content">{{ props.title }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    required: true,
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '100%'
  }
})
</script>

<style lang="scss" scoped>
.title-bar {
  height: 50px;
  background-color: #eee;
  border-radius: 3px;
  padding-left: 20px;
  line-height: 50px;
  font-size: 20px;
  font-weight: bold;
  color: #000;
  position: relative;
  .bar-content {
    margin-left: 20px;
  }
}
.bar-content::before {
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