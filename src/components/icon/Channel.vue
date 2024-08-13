<template>
  <svg t="1723535827494" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5168" :width="props.size" :height="props.size">
    <path
      d="M754.062222 477.127111l-212.195555 122.481778v245.020444L754.062222 967.111111l212.195556-122.481778V599.608889l-212.195556-122.481778zM56.888889 599.608889v245.020444L269.084444 967.111111l212.195556-122.481778V599.608889L269.084444 477.127111 56.888889 599.608889z m666.737778-420.238222L511.431111 56.888889 299.235556 179.370667V424.391111l212.195555 122.481778 212.195556-122.481778V179.370667z"
      :fill="props.color"
      p-id="5169"
    ></path>
  </svg>
</template>
<script setup>
const props = defineProps({
  color: {
    type: String,
    default: '#0099CD'
  },
  size: {
    type: Number,
    default: 14
  }
});
</script>
