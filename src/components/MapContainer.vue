<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";

const mapRef = ref(null);
const showDialog = ref(false);
const searchName = ref("")
const lng = defineModel("lng");
const lat = defineModel("lat");
const marker = ref(null);
const emit = defineEmits(['reload']);
const formData = ref({
  address: "",
});

watch(showDialog, val => {
  if (val) {
    nextTick(() => {
      initMap();
    })
  } else {
    destroyDialog();
  }
})

const openDialog = (lat, lng) => {
  showDialog.value = true;
  formData.value.address = "";
}

const initMap = () => {
  const secret = import.meta.env.VITE_AMAP_SERCRET;
  const key = import.meta.env.VITE_AMAP_KEY;
  window._AMapSecurityConfig = {
    securityJsCode: secret,
  };
  AMapLoader.load({
    key: key,
    version: "2.0",
    // 需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    plugins: ["AMap.AutoComplete", "AMap.PlaceSearch", "AMap.Marker"],
  }).then((AMap) => {
    mapRef.value = new AMap.Map("mapContainer", {
      zoom: 11,
      center: [116.397428, 39.90923],
    });
    const autoComplete = new AMap.AutoComplete({input: "searchName"});
    const placeSearch = new AMap.PlaceSearch({map: mapRef.value});
    placeSearch.on("markerClick", (e) => {
      console.log("大点位了", e)
      lat.value = e.data.location.lat;
      lng.value = e.data.location.lng;
    })
    autoComplete.on("select", (e) => {
      placeSearch.setCity(e.poi.adcode);
      placeSearch.search(e.poi.name);
    })
    mapRef.value.on("click", (e) => {
      lat.value = e.lnglat.getLat();
      lng.value = e.lnglat.getLng();
      addMarker();
    });
  }).catch((e) => {
    console.warn(e);
  });
}

const addMarker = () => {
  if (!lat.value || !lng.value) {
    return;
  }
  if (marker.value) {
    marker.value.setPosition([lng.value, lat.value]);
    return;
  }
  marker.value = new AMap.Marker({
    icon: "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
    position: [lng.value, lat.value],
    offset: new AMap.Pixel(-25, -55)
  })
  marker.value.setMap(mapRef.value);
}

const destroyDialog = () => {
  mapRef.value?.destroy();
  marker.value?.setMap(null);
  marker.value = null;
}

const handleSave = () => {

}

defineExpose({
  openDialog
})

</script>

<template>
  <el-dialog title="选取点位" v-model="showDialog" width="800px" draggable align-center :close-on-click-modal="false">
    <div class="map-header">
      <el-input id="searchName" v-model="searchName" placeholder="请输入地址" @keyup.enter="handleSave" style="width: 300px !important;" size="small"/>
      <div class="map-header-show">
        <el-input v-model="lat" placeholder="经度"  size="small" disabled/>&nbsp;
        <el-input v-model="lng" placeholder="纬度" size="small" disabled/>
      </div>
    </div>
    <div id="mapContainer" class="dialog-map-content">
    </div>
    <template #footer>
      <span>
        <el-button @click=" showDialog = false">取消</el-button>
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