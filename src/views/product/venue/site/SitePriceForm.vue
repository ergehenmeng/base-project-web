<template>
  <div class="edit-content">
    <el-divider />
    <div style="display: flex; justify-content: space-between">
      <div>
        <el-button v-has-perm="'ACO0'" type="primary" :icon="Setting" @click="handleSetting">批量设置</el-button>
      </div>
      <div>
        <el-button-group style="margin-bottom: 10px">
          <el-button @click="changeMonth('last')"> 上一月</el-button>
          <el-button @click="changeMonth('now')">今日</el-button>
          <el-button @click="changeMonth('next')">下一月</el-button>
        </el-button-group>
      </div>
    </div>
    <div style="clear: both" v-loading="loading" >
      <el-tabs type="card" v-model="activeDay" @tab-change="handleTabChange">
        <el-tab-pane v-for="(item, index) in dayList" :label="item" :key="index" :name="item"></el-tab-pane>
      </el-tabs>
      <div style="padding-top: 20px; display: flex; justify-content: center">
        <TimePhase v-model:phase-list="phaseList" :disabled="!setupAuth" :now-date="activeDay" :venue-site-id="venueSiteId"></TimePhase>
      </div>
    </div>
  </div>
</template>
<script setup>
import { priceListApi } from '@/api/product/site';
import dayjs from 'dayjs';
import { Setting } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import TimePhase from '@/components/TimePhase.vue';
import usePermStore from '@/store/perm';

const permStore = usePermStore();
const setupAuth = permStore.hasAuth('ACO0');
const router = useRouter();
const route = useRoute();
const dayList = ref([]);
const activeDay = ref(dayjs().format('YYYY-MM-DD'));
const phaseList = ref([]);
const loading = ref(false);
const venueSiteId = ref();

onMounted(() => {
  venueSiteId.value = route.params.id;
  generateDayList(dayjs());
  handleTabChange(dayjs().format('YYYY-MM-DD'));
});

const changeMonth = (value) => {
  let date;
  if (value === 'last') {
    date = dayjs(activeDay.value, 'YYYY-MM-DD').subtract(1, 'month');
  } else if (value === 'next') {
    date = dayjs(activeDay.value, 'YYYY-MM-DD').add(1, 'month');
  } else {
    date = dayjs();
  }
  activeDay.value = date.format('YYYY-MM-DD');
  generateDayList(date);
  handleTabChange(activeDay.value)
};

const generateDayList = (date) => {
  dayList.value = [];
  const startDay = date.startOf('month');
  const endDay = date.endOf('month');
  const day = endDay.diff(startDay, 'day') + 1;
  for (let i = 1; i <= day; i++) {
    dayList.value.push(date.date(i).format('YYYY-MM-DD'));
  }
};
const handleSetting = () => {
  const params = route.params;
  router.push('/product/site/setting/' + params.id);
};

const handleTabChange = (value) => {
  loading.value = true
  priceListApi({ venueSiteId: route.params.id, nowDate: value }).then((res) => {
    phaseList.value = res.data;
  }).finally(() => {
    loading.value = false;
  });
};
</script>
