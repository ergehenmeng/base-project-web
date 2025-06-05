<script setup>
import { bindApi, bindDetailApi } from '@/api/poi/line';
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
const defaultZoom = import.meta.env.VITE_MAP_ZOOM;
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
// 步行路线
const polylineRef = ref([]);

/**
 * 添加标记点
 * @param lng 经度
 * @param lat 维度
 * @param content 点位显示内容
 */
const addMarker = (lng, lat, content) => {
  const marker = new AMap.Marker({
    position: [lng, lat],
    offset: new AMap.Pixel(-9, -21),
    content: markerContent(content),
  });
  marker.setMap(mapRef.value);
  markerList.value.push(marker);
};

const markerContent = (marker) => {
  return `<div class="custom-content-marker">
    <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png" alt="途径点位">
    <div class="marker-content">${marker}</div></div>
  </div>`;
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
    plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch', 'AMap.Marker', 'AMap.Walking']
  })
    .then((AMap) => {
      mapRef.value = new AMap.Map('mapContainer', {
        zoom: defaultZoom,
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
  clearLineRoute();
  clearMarker();
};

const clearLineRoute = () => {
  polylineRef.value.forEach((item) => {
    item.setMap(null);
  });
  polylineRef.value = [];
};

const clearMarker = () => {
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
  // 清空之前的线路和点位
  clearLineRoute();
  clearMarker();
  for (let i = 0; i < locationList.length; i++) {
    // 此处增加判断是因为如果点位删除,此处曾经绑定的点位没有经纬度
    if (pointMap.has(locationList[i])) {
      const location = pointMap.get(locationList[i]);
      addMarker(location.longitude, location.latitude, i + 1);
      linePath.push([location.longitude, location.latitude]);
    }
  }
  walkingLayout(linePath);
};

/**
 * 步行路线规划
 * @param points 经纬度列表
 */
const walkingLayout = (points) => {
  if (points.length < 2) {
    return;
  }
  const walking = new AMap.Walking({})
  for (let i = 0; i < points.length; i++) {
    if (i < points.length - 1) {
      walking.search(points[i], points[i + 1], (status, result) => {
        if (status === 'complete') {
          if (result.routes && result.routes.length) {
            drawRoute(result.routes[0])
          }
        } else {
          console.log('步行路线结果数据异常', result)
        }
      })
    }
  }
};

function drawRoute (route) {
  const path = parseRouteToPath(route)
  let routeLine = new AMap.Polyline({
    path: path,
    isOutline: true,
    outlineColor: '#ffeeee',
    borderWeight: 2,
    strokeWeight: 4,
    strokeOpacity: 1,
    strokeColor: '#1890FF',
    lineJoin: 'round'
  })
  mapRef.value.add(routeLine);
  polylineRef.value.push(routeLine);
}

function parseRouteToPath(route) {
  const path = []
  for (let i = 0, l = route.steps.length; i < l; i++) {
    const step = route.steps[i]
    for (let j = 0, n = step.path.length; j < n; j++) {
      path.push(step.path[j])
    }
  }
  return path
}

const handleSave = () => {
  if (pointList.value.length < 1) {
    errorMsg('请选择至少两个点位');
    return;
  }
  const formData = {
    lineId: route.params.id,
    pointIds: pointList.value
  };
  bindApi(formData).then(() => {
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