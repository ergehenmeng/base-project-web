<script setup>
import { bindApi, bindDetailApi } from '@/api/poi/line';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AMapLoader from '@amap/amap-jsapi-loader';
import { errorMsg, successMsg } from '@/utils/message.js';
import { goBack } from '@/utils/common.js';

const mapRef = ref(null);
const markerList = ref([]);
const secret = import.meta.env.VITE_MAP_SECRET;
const key = import.meta.env.VITE_MAP_KEY;
const defaultLng = import.meta.env.VITE_MAP_LNG;
const defaultLat = import.meta.env.VITE_MAP_LAT;

const route = useRoute();
const router = useRouter();
const disabled = ref(false);
// 选中的点位
const pointList = ref([]);
// 所有点位
const dataList = ref([]);
// 右侧选中的点位
const sortList = ref([]);
// 点位 <-> 经纬度
const pointMap = new Map();

const polylineRef = ref(null);

/**
 * 添加标记点
 * @param lng 经度
 * @param lat 维度
 */
const addMarker = (lng, lat) => {
  const marker = new AMap.Marker({
    icon: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
    position: [lng, lat],
    offset: new AMap.Pixel(-9, -21)
  });
  marker.setMap(mapRef.value);
  markerList.value.push(marker);
};

/**
 * 初始化高德地图, 指定默认显示的位置
 */
const initMap = (callback, lng = defaultLng, lat = defaultLat) => {
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
        zoom: 13,
        center: [lng, lat]
      });
      callback();
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
  markerList.value.forEach((item) => {
    item.setMap(null);
  });
};

onUnmounted(() => {
  destroyMap();
});

/**
 * 刷新地图点位
 * @param locationList 点位ID(不含经纬度) array
 */
const refreshMarker = (locationList) => {
  const linePath = [];
  locationList.forEach((item) => {
    if (pointMap.has(item)) {
      const location = pointMap.get(item);
      addMarker(location.longitude, location.latitude);
      linePath.push([location.longitude, location.latitude]);
    }
  });
  const polyline = new AMap.Polyline({
    path: linePath,
    strokeWeight: 3,
    strokeColor: 'blue',
    lineJoin: 'round',
    lineCap: 'round'
  });
  if (polylineRef.value) {
    mapRef.value.remove(polylineRef.value);
  }
  mapRef.value.add(polyline);
  polylineRef.value = polyline;
};

const handleSave = () => {
  if (pointList.value.length < 1) {
    errorMsg('请选择至少两个点位');
    return;
  }
  const formData = {
    lineId: route.params.id,
    pointIds: pointList.value
  };
  bindApi(formData).then((res) => {
    successMsg('线路点位绑定成功');
    goBack(router);
  });
};

const getDetail = () => {
  const params = route.params;
  bindDetailApi({ id: params.id }).then(({ data: { checkedList, pointList: points } }) => {
    dataList.value = points;
    pointList.value = checkedList;
    points.forEach((item) => {
      pointMap.set(item.id, item);
    });
    refreshMarker(checkedList);
  });
};

onMounted(() => {
  initMap(
    () => {
      getDetail();
    },
    route.query.lng,
    route.query.lat
  );
});

const handleUp = () => {
  if (sortList.value.length > 1 || sortList.value.length === 0) {
    errorMsg('请选择一个要排序的点位');
    return;
  }
  const itemId = sortList.value[0];
  const points = pointList.value;
  const index = points.indexOf(itemId);
  if (index <= 0) {
    return;
  }
  const before = points[index - 1];
  points.splice(index - 1, 1, itemId);
  points.splice(index, 1, before);
  pointList.value = points;
  refreshMarker(pointList.value);
};

const handleDown = () => {
  if (sortList.value.length > 1 || sortList.value.length === 0) {
    errorMsg('请选择一个要排序的点位');
    return;
  }
  const points = pointList.value;
  const itemId = sortList.value[0];
  const index = points.indexOf(itemId);
  if (index === -1 || index === points.length - 1) {
    return;
  }
  const after = points[index + 1];
  points.splice(index + 1, 1, itemId);
  points.splice(index, 1, after);
  pointList.value = points;
  refreshMarker(pointList.value);
};

const handleRightCheckChange = (val) => {
  sortList.value = val;
};

const pointChange = () => {
  refreshMarker(pointList.value);
};
</script>

<template>
  <div class="edit-content">
    <div id="app">
      <div id="mapContainer" style="height: calc(100vh - 190px)"></div>
      <div class="transfer-card">
        <el-transfer
          v-model="pointList"
          :data="dataList"
          :props="props"
          style="height: 280px; width: 432px"
          :titles="['未选择', '已选择']"
          target-order="push"
          @right-check-change="handleRightCheckChange"
          @change="pointChange"
        >
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
        <el-button @click="goBack($router)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
      <div class="edit-button-footer" v-else>
        <el-button @click="goBack($router)">返回</el-button>
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

.edit-content {
  padding: 20px 20px 50px 20px;
  background-color: white;
  border-radius: 3px;
  min-height: calc(100vh - 120px);
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