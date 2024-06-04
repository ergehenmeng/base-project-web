<script setup>
import AMapLoader from "@amap/amap-jsapi-loader";

const mapRef = ref(null);
const showDialog = ref(false);

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
    const placeSearch = new AMap.PlaceSearch({
      map: mapRef.value,
      panel: "result"
    });
    AMap.Event.addListener(placeSearch, "complete");
    placeSearch.search()

  }).catch((e) => {
    console.warn(e);
  });
}


const destroyDialog = () => {
  mapRef.value?.destroy();
}

const handleSave = () => {

}

defineExpose({
  openDialog
})

</script>

<template>
  <el-dialog title="选取点位" v-model="showDialog" width="800px" draggable align-center :close-on-click-modal="false">
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
  width: 750px;
  height: 500px;
}
</style>