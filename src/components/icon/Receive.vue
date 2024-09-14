<template>
  <svg t="1726297002426" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7770" :width="props.size" :height="props.size">
    <path d="M704 512a206.72 206.72 0 1 0 206.72 206.08A206.08 206.08 0 0 0 704 512z m0 361.6a155.52 155.52 0 1 1 154.88-155.52A154.88 154.88 0 0 1 704 872.32z" :fill="props.color" p-id="7771"></path>
    <path d="M703.36 716.8m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" :fill="props.color" p-id="7772"></path>
    <path
      d="M777.6 89.6H243.84a135.04 135.04 0 0 0-137.6 131.2v576a134.4 134.4 0 0 0 137.6 128h175.36a32 32 0 0 0 32-32 32 32 0 0 0-32-32H243.84a70.4 70.4 0 0 1-73.6-64v-576A71.04 71.04 0 0 1 243.84 153.6h533.76a71.04 71.04 0 0 1 73.6 67.2v210.56a32 32 0 0 0 32 32 32 32 0 0 0 32-32V220.8a135.04 135.04 0 0 0-137.6-131.2z"
      :fill="props.color"
      p-id="7773"
    ></path>
    <path
      d="M320 352.64h371.2a32 32 0 0 0 32-32 32 32 0 0 0-32-32H320a32 32 0 0 0-32 32 32 32 0 0 0 32 32zM320 512h172.8a32 32 0 0 0 32-32 32 32 0 0 0-32-32H320a32 32 0 0 0-32 32 32 32 0 0 0 32 32z"
      :fill="props.color"
      p-id="7774"
    ></path>
  </svg>
</template>
<script setup>
const props = defineProps({
  color: {
    type: String,
    default: '#e84393'
  },
  size: {
    type: Number,
    default: 14
  }
});
</script>
