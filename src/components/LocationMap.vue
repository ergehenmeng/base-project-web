<template>
  <div>
    <el-input v-model="longitude" show-word-limit readonly style="width: 120px !important;" />-<el-input v-model="latitude" show-word-limit readonly style="width: 120px !important;" />&nbsp;<el-button type="primary" @click="handleMap">选择</el-button>
    <MapContainer ref="mapRef" @reload="setLocation"></MapContainer>
  </div>
</template>
<script setup>
import MapContainer from '@/components/MapContainer.vue';

const mapRef = ref();
let longitude = defineModel('longitude');
let latitude = defineModel('latitude');

const handleMap = () => {
  mapRef.value.openDialog(longitude.value, latitude.value);
};

const setLocation = (lng, lat) => {
  longitude.value = lng;
  latitude.value = lat;
};
</script>