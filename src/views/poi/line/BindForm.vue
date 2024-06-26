<script setup>
import { bindDetailApi } from '@/api/poi/line';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AMapLoader from '@amap/amap-jsapi-loader';

const mapRef = ref(null);
const marker = ref(null);
const secret = import.meta.env.VITE_MAP_SECRET;
const key = import.meta.env.VITE_MAP_KEY;
const defaultLng = import.meta.env.VITE_MAP_LNG;
const defaultLat = import.meta.env.VITE_MAP_LAT;

const route = useRoute();
const router = useRouter();
const disabled = ref(false);
const pointList = ref([]);
const valueList = ref([]);
const rightChecked = ref([]);

const addMarker = (lng, lat) => {
  if (marker.value) {
    marker.value.setPosition([lng, lat]);
    return;
  }
  marker.value = new AMap.Marker({
    icon: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
    position: [lng, lat],
    offset: new AMap.Pixel(-9, -21)
  });
  marker.value.setMap(mapRef.value);
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
      const map = new AMap.Map('mapContainer', {
        zoom: 11,
        center: [defaultLng, defaultLat]
      });
      map.on('click', (e) => {
        addMarker(e.lnglat.getLng(), e.lnglat.getLat());
      });
      mapRef.value = map;
    })
    .catch((e) => {
      console.warn(e);
    });
};

const props = ref({
  key: 'id',
  label: 'title'
});

const destroyMap = () => {
  mapRef.value?.destroy();
  marker.value?.setMap(null);
  marker.value = null;
};

onUnmounted(() => {
  destroyMap();
});

const handleSave = () => {};

onMounted(() => {
  initMap();
  const params = route.params;
  bindDetailApi({ id: params.id }).then(({ data }) => {
    valueList.value = data.pointList;
  });
});

const handleUp = () => {
  console.log(rightChecked.value, pointList.value);
};
const handleDown = () => {};

</script>

<template>
  <div class="edit-content">
    <el-divider />
    <div id="app">
      <div id="mapContainer" style="height: calc(100vh - 240px)"></div>
      <div class="transfer-card">
        <el-transfer v-model="pointList" :data="valueList" :props="props" style="height: 280px; width: 432px" :titles="['未选择', '已选择']" :right-default-checked="rightChecked">
          <template #default="{ option }">
            <span :title="option.title">{{ option.title }}</span>
          </template>
          <template #right-footer>
            <el-button-group>
              <el-button size="small" @click="handleUp">上移</el-button>
              <el-button size="small" @click="handleDown">下移</el-button>
            </el-button-group>
          </template>
        </el-transfer>
      </div>
    </div>
    <div>
      <div class="edit-button-footer" v-if="!disabled">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
      <div class="edit-button-footer" v-else>
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.el-transfer {
  --el-transfer-panel-width: 150px;
  --el-transfer-panel-header-height: 32px;
  --el-transfer-panel-body-height: 208px;
}

#app {
  position: relative;

  .transfer-card {
    position: absolute;
    height: 280px;
    top: 10px;
    left: 10px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>