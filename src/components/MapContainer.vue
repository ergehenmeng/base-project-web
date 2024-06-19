<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { errorMsg } from '@/utils/message.js';

const mapRef = ref(null);
const showDialog = ref(false);
const searchName = ref('');
const lat = ref('');
const lng = ref('');
const marker = ref(null);
const emit = defineEmits(['reload']);
const secret = import.meta.env.VITE_MAP_SECRET;
const key = import.meta.env.VITE_MAP_KEY;
const defaultLng = import.meta.env.VITE_MAP_LNG;
const defaultLat = import.meta.env.VITE_MAP_LAT;

watch(showDialog, (val) => {
  if (val) {
    nextTick(() => {
      initMap();
    });
  } else {
    destroyDialog();
  }
});

const openDialog = (inLat, inLng) => {
  showDialog.value = true;
  lng.value = inLng;
  lat.value = inLat;
};

const initMap = () => {
  window._AMapSecurityConfig = {
    securityJsCode: secret
  };
  AMapLoader.load({
    key: key,
    version: '2.0',
    // 需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.Marker']
  })
    .then((AMap) => {
      mapRef.value = new AMap.Map('mapContainer', {
        zoom: 11,
        center: [defaultLng, defaultLat]
      });
      const autoComplete = new AMap.AutoComplete({ input: 'searchName' });
      const placeSearch = new AMap.PlaceSearch({ map: mapRef.value });
      placeSearch.on('markerClick', (e) => {
        lng.value = e.data.location.lng;
        lat.value = e.data.location.lat;
      });
      autoComplete.on('select', (e) => {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);
      });
      mapRef.value.on('click', (e) => {
        lng.value = e.lnglat.getLng();
        lat.value = e.lnglat.getLat();
        addMarker();
      });
      addMarker();
    })
    .catch((e) => {
      console.warn(e);
    });
};

const addMarker = () => {
  if (!lng.value || !lat.value) {
    return;
  }
  if (marker.value) {
    marker.value.setPosition([lng.value, lat.value]);
    return;
  }
  marker.value = new AMap.Marker({
    icon: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
    position: [lng.value, lat.value],
    offset: new AMap.Pixel(-9, -21)
  });
  marker.value.setMap(mapRef.value);
};

const destroyDialog = () => {
  mapRef.value?.destroy();
  marker.value?.setMap(null);
  marker.value = null;
};

const handleSave = () => {
  if (!lat.value || !lng.value) {
    errorMsg('请点击选择点位信息');
    return;
  }
  showDialog.value = false;
  emit('reload', lng.value, lat.value);
};

defineExpose({
  openDialog
});
</script>

<template>
  <el-dialog title="选取点位" v-model="showDialog" width="800px" draggable align-center :close-on-click-modal="false">
    <div class="map-header">
      <el-input id="searchName" v-model="searchName" placeholder="请输入地址" style="width: 250px !important" size="small" />
      <div class="map-header-show">
        <el-input v-model="lng" placeholder="经度" size="small" readonly />&nbsp;
        <el-input v-model="lat" placeholder="纬度" size="small" readonly />
      </div>
    </div>
    <div id="mapContainer" class="dialog-map-content"></div>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.dialog-map-content {
  height: 500px;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .map-header-show {
    width: 250px;
    display: flex;
  }
}
</style>