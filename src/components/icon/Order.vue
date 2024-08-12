<template>
  <svg t="1723474121024" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14358" :width="props.size" :height="props.size">
    <path d="M672 672m-240 0a240 240 0 1 0 480 0 240 240 0 1 0-480 0Z" fill="#EEFAF0" p-id="14359"></path>
    <path
      d="M848 80H178c-35.2 0-64 28.8-64 64v736c0 35.2 28.8 64 64 64h538c107.8 0 196-88.2 196-196V144c0-35.2-28.8-64-64-64z m-16 668c0 30.8-12.1 59.8-34.1 81.9S746.8 864 716 864H226c-17.7 0-32-14.3-32-32V192c0-17.7 14.3-32 32-32h574c17.7 0 32 14.3 32 32v556z"
      :fill="props.color"
      p-id="14360"
    ></path>
    <path
      d="M672 472H352c-22 0-40 18-40 40s18 40 40 40h320c22 0 40-18 40-40s-18-40-40-40zM452 655H352c-22 0-40 18-40 40s18 40 40 40h100c22 0 40-18 40-40s-18-40-40-40zM562 288H352c-22 0-40 18-40 40s18 40 40 40h210c22 0 40-18 40-40s-18-40-40-40z"
      :fill="props.color"
      p-id="14361"
    ></path>
  </svg>
</template>
<script setup>
const props = defineProps({
  color: {
    type: String,
    default: '#1CC6A1'
  },
  size: {
    type: Number,
    default: 14
  }
});
</script>
