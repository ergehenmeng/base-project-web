<template>
  <el-tooltip :effect="props.effect" :content="props.content" :placement="props.placement">
    <el-button type="primary" link>
      <Question :size="props.size"></Question>
    </el-button>
  </el-tooltip>
</template>
<script setup>
import Question from '@/components/icon/Question.vue';

const props = defineProps({
  content: {
    type: String
  },
  effect: {
    type: String,
    default: 'dark'
  },
  placement: {
    type: String,
    default: 'top'
  },
  size: {
    type: Number,
    default: 14
  }
});
</script>
