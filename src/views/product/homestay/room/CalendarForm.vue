<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item v-has-perm="'pbO0'" style="margin-left: 20px">
          <el-button type="primary" :icon="Setting" @click="handleConfig">配置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <div style="display: flex; justify-content: right; padding: 5px; height: 35px">
            <div style="display: flex; justify-content: center">
              <span style="line-height: 25px">不可预定：</span>
              <div style="width: 40px; height: 25px; background-color: #ff5151"></div>
            </div>
            <div style="display: flex; justify-content: center">
              <span style="line-height: 25px">&nbsp;可预定：</span>
              <div style="width: 40px; height: 25px; background-color: #54c444"></div>
            </div>
            <div style="display: flex; justify-content: center">
              <span style="line-height: 25px">&nbsp;已过期：</span>
              <div style="width: 40px; height: 25px; background-color: #c7c7c7"></div>
            </div>
            <div style="display: flex; justify-content: center">
              <span style="line-height: 25px">&nbsp;未录入：</span>
              <div style="width: 40px; height: 25px; background-color: #ffaa44"></div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-calendar ref="calendar" v-model="nowDate">
        <template #header="{ date }">
          <span>{{ date }}</span>
          <el-button-group>
            <el-button size="small" @click="selectDate('prev-month')"> 上一月</el-button>
            <el-button size="small" @click="selectDate('today')">今天</el-button>
            <el-button size="small" @click="selectDate('next-month')"> 下一月</el-button>
          </el-button-group>
        </template>
        <template #date-cell="{ data }">
          <div class="item-expire" v-if="hasExpire(data)">
            <div class="item-date">{{ data.day.split('-')[2] }}</div>
            <div class="item-bottom">已过期</div>
          </div>
          <div class="item-price" v-else-if="hasSetPrice(data)" @click.stop.prevent="handleEdit(dayPrice(data))">
            <div class="item-header">
              <div class="item-date">{{ data.day.split('-')[2] }}</div>
              <p class="item-price-num">划线价:{{ dayPrice(data)?.linePrice }}</p>
            </div>
            <p class="item-price-num">销售价:{{ dayPrice(data)?.salePrice }}</p>
            <div :class="['item-stock', dayPrice(data)?.state === false || dayPrice(data)?.stock === 0 ? 'item-forbid' : '']">库存:{{ dayPrice(data)?.stock }} </div>
          </div>
          <div class="item-no-price" v-else @click.stop.prevent="handleCreate(data.day)">
            <div class="item-date">{{ data.day.split('-')[2] }}</div>
            <div class="item-bottom">暂未录入</div>
          </div>
        </template>
      </el-calendar>
    </div>
  </div>
  <SetupForm ref="setupRef" @reload="getList" />
  <EditForm ref="editRef" @reload="getList" />
</template>
<script setup>
import { monthApi } from '@/api/product/room';
import { Setting } from '@element-plus/icons-vue';
import { errorMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import SetupForm from './SetupForm.vue';
import EditForm from './EditForm.vue';

const route = useRoute();
const userStore = useUserStore();
const setupRef = ref();
const editRef = ref();
const loading = ref(false);
const calendar = ref();
const nowDate = ref(new Date());
const dataMap = ref({});
const selectAuth = userStore.hasAuth('hbO0');
const editAuth = userStore.hasAuth('XbO0');

const queryParams = reactive({
  roomId: null,
  month: dayjs().format('YYYY-MM')
});

const getList = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await monthApi(queryParams);
      data.forEach((item) => {
        dataMap.value[item.configDate] = item;
      });
    }
  } finally {
    loading.value = false;
  }
};

onBeforeMount(() => {
  const params = route.params;
  if (!params.id) {
    errorMsg('请选择房型');
    return;
  }
  queryParams.roomId = params.id;
  getList();
});

const selectDate = (val) => {
  if (!calendar.value) {
    return;
  }
  calendar.value.selectDate(val);
  queryParams.month = dayjs(nowDate.value).format('YYYY-MM');
  getList();
};

const dayPrice = computed(() => {
  return (data) => {
    for (let key in dataMap.value) {
      if (key === data.day) {
        return dataMap.value[key];
      }
    }
    return null;
  };
});

const hasSetPrice = computed(() => {
  return (data) => {
    for (let key in dataMap.value) {
      if (key === data.day) {
        return dataMap.value[key].hasSet;
      }
    }
    return false;
  };
});

const hasExpire = computed(() => {
  return (data) => {
    return data.date < Date.now() - 8.64e7;
  };
});

const handleConfig = () => {
  setupRef.value.openDialog(queryParams.roomId);
};

const handleEdit = (item) => {
  if (editAuth) {
    editRef.value.openDialog(queryParams.roomId, item);
  }
};

const handleCreate = (date) => {
  if (editAuth) {
    editRef.value.openDialog(queryParams.roomId, { configDate: date });
  }
};
</script>
<style lang="scss" scoped>
.calender-msg-list {
  list-style: none;
}

.item-no-price {
  font-size: 14px;

  .item-date {
    font-weight: bold;
    padding: 8px 0 20px 10px;
    background-color: #ffeedd;
  }

  .item-bottom {
    background-color: #ffaa44;
    padding: 3px 13px;
    text-align: right;
  }
}

.item-price {
  padding: 5px;
  font-size: 14px;
  color: #000000;

  .item-header {
    display: flex;
    justify-content: space-between;

    .item-date {
      font-weight: bold;
    }
  }

  .item-stock {
    background-color: #54c444;
    padding: 3px 13px;
    text-align: right;
  }

  .item-forbid {
    background-color: #ff5151 !important;
  }

  .item-price-num {
    text-align: right;
  }
}

.item-expire {
  font-size: 14px;
  color: #8c939d;

  .item-date {
    font-weight: bold;
    padding: 8px 0 20px 10px;
    background-color: #e5e5e5;
  }

  .item-bottom {
    background-color: #c7c7c7;
    padding: 3px 13px;
    text-align: right;
  }
}
</style>
