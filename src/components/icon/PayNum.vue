<template>
  <svg t="1723084118980" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17729" :width="props.size" :height="props.size">
    <path
      d="M235.5 545.1c0-19.2-15.7-35-35-35H98.2c-19.2 0-35 15.7-35 35v2.2h-0.1v374.4h172.4V547.4h-0.1v-2.3zM718.4 408.4c0-19.2-15.7-35-35-35H581.1c-19.2 0-35 15.7-35 35v2.8h-0.1v510.5h172.5V411.3h-0.1v-2.9zM959.8 649.5v-11.4c0-19.2-15.7-35-35-35H822.6c-19.2 0-35 15.7-35 35v11.4h-0.1v272.3H960V649.5h-0.2zM476.9 136.9c0-19.2-15.7-35-35-35H339.7c-19.2 0-35 15.7-35 35v2.1h-0.2v782.8H477V136.9z"
      :fill="props.color"
      p-id="17730"
    ></path>
  </svg>
</template>
<script setup>
const props = defineProps({
  color: {
    type: String,
    default: '#F7B538'
  },
  size: {
    type: Number,
    default: 14
  }
});
</script>
