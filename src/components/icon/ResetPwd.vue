<template>
  <svg t="1722930756435" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11740" :width="props.size" :height="props.size">
    <path
      d="M960 512h64c0 281.6-230.4 512-512 512S0 793.6 0 512 230.4 0 512 0c153.6 0 288 70.4 384 172.8V64h64v256H704v-64h172.8C800 140.8 665.6 64 512 64 262.4 64 64 262.4 64 512s198.4 448 448 448 448-198.4 448-448zM512 256c70.4 0 128 57.6 128 128v64c38.4 0 64 25.6 64 64v192c0 38.4-25.6 64-64 64H384c-38.4 0-64-25.6-64-64V512c0-38.4 25.6-64 64-64v-64c0-70.4 57.6-128 128-128z m64 128c0-38.4-25.6-64-64-64s-64 25.6-64 64v64h128v-64zM384 640c0 38.4 25.6 64 64 64h128c38.4 0 64-25.6 64-64v-64c0-38.4-25.6-64-64-64H448c-38.4 0-64 25.6-64 64v64z"
      :fill="props.color"
      p-id="11741"
    ></path>
  </svg>
</template>
<script setup>
const props = defineProps({
  color: {
    type: String,
    default: '#1B7AFF'
  },
  size: {
    type: Number,
    default: 12
  }
});
</script>