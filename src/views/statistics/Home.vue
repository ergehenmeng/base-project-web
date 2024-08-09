<template>
  <div class="edit-content">
    <el-divider />
    <el-row>
      <StatisticsCard title="累计订单数" amount="321,123">
        <PayNum :size="50"></PayNum>
      </StatisticsCard>
      <StatisticsCard title="累计订单金额" amount="321,123">
        <PayAmount :size="50"></PayAmount>
      </StatisticsCard>
      <StatisticsCard title="累计退单数" amount="321,123">
        <RefundNum :size="50"></RefundNum>
      </StatisticsCard>
      <StatisticsCard title="累计退款金额" amount="321,123">
        <RefundAmount :size="50"></RefundAmount>
      </StatisticsCard>
    </el-row>
    <el-row>
      <StatisticsChart title="订单统计" :height="350" :span="24">
        <template #icon><Line></Line></template>
        <template #action>
          <div style="display: flex; justify-content:center; align-items: center">
            <el-radio-group style="margin-right: 20px" v-model="orderParams.selectType" @change="queryOrderHandler">
              <el-radio-button value="week">周</el-radio-button>
              <el-radio-button value="month">月</el-radio-button>
              <el-radio-button value="year">年</el-radio-button>
              <el-radio-button value="custom">自定义</el-radio-button>
            </el-radio-group>
            <el-date-picker v-model="orderParams.activeDate" :disabled="orderDisabled" type="daterange" value-format="YYYY-MM-DD" class="w220" :disabled-date="(time) => disabledDate('order', time)" @calendar-change="calendarChangeHandler('order', $event)" @change="getDayOrderData"></el-date-picker>
          </div>
        </template>
        <template #content>
          <div id="orderApp" style="width: 100%; height: 100%"></div>
        </template>
      </StatisticsChart>
    </el-row>
    <el-row>
      <StatisticsChart title="注册统计" :height="300" :span="24">
        <template #icon>
          <UserList></UserList>
        </template>
        <template #action>
        <div style="display: flex; justify-content:center; align-items: center">
          <el-radio-group style="margin-right: 20px" v-model="registerParams.selectType" @change="queryRegisterHandler">
            <el-radio-button value="week">周</el-radio-button>
            <el-radio-button value="month">月</el-radio-button>
            <el-radio-button value="year">年</el-radio-button>
            <el-radio-button value="custom">自定义</el-radio-button>
          </el-radio-group>
          <el-date-picker v-model="registerParams.activeDate" :disabled="registerDisabled" type="daterange" value-format="YYYY-MM-DD" class="w220" :disabled-date="(time) => disabledDate('register', time)" @calendar-change="calendarChangeHandler('register', $event)" @change="getDayRegisterData"></el-date-picker>
        </div>
        </template>
        <template #content>
          <div id="registerApp" style="width: 100%; height: 100%"></div>
        </template>
      </StatisticsChart>
    </el-row>
  </div>
</template>

<script setup>
import { registerApi, dayRegisterApi, orderApi, dayOrderApi } from '@/api/home/statistics';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { DatasetComponent, GridComponent, TitleComponent, TooltipComponent, TransformComponent, ToolboxComponent, LegendComponent } from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import RefundNum from '@/components/icon/RefundNum.vue'
import StatisticsCard from '@/components/StatisticsCard.vue'
import PayAmount from '@/components/icon/PayAmount.vue'
import PayNum from '@/components/icon/PayNum.vue'
import RefundAmount from '@/components/icon/RefundAmount.vue'
import StatisticsChart from '@/components/StatisticsChart.vue'
import UserList from '@/components/icon/UserList.vue'
import Line from '@/components/icon/Line.vue'
import dayjs from "dayjs";

// 注册必须的组件
echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, BarChart, LabelLayout, UniversalTransition, CanvasRenderer, ToolboxComponent, LegendComponent]);

let orderChart;
let registerChart;

const orderOption = (dataList) => {
  orderChart.setOption({
    color: ['#9dd3e8', '#fc8452'],
    grid: {
      left: '4%',
      right: '4%',
      bottom: '10%'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['订单数', '交易额(元)']
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        axisPointer: {
          type: 'shadow'
        },
        data: dataList.map(item => item.createDate),
      }
    ],
    yAxis: [
      {
        position: 'left',
        type: 'value',
        name: '订单数',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#aaa'
          }
        },
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        position: 'right',
        type: 'value',
        name: '交易额(元)',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#aaa'
          }
        },
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '订单数',
        type: 'bar',
        yAxisIndex: 0,
        data: dataList.map(item => item.orderNum)
      },
      {
        yAxisIndex: 1,
        name: '交易额(元)',
        type: 'line',
        smooth: true,
        data: dataList.map(item => item.payAmount)
      }
    ]
  });
}


const registerOption = (dataList) => {
  registerChart.setOption({
    color: ['#9dd3e8', '#fc8452', '#2335ed', '#6ded23'],
    grid: {
      left: '4%',
      right: '4%',
      bottom: '10%'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['注册人数']
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: dataList.map(item => item.createDate),
      }
    ],
    yAxis: {
      type: 'value',
      position: 'left',
      name: '注册人数',
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#aaa'
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [
      {
        name: '注册人数',
        type: 'line',
        smooth: true,
        color: '#1e90ff',
        data: dataList.map(item => item.registerNum)
      }
    ]
  });
}

const chooseMap = new Map();

const orderParams = reactive({
  activeDate: [],
  selectType: 'week'
});

const registerParams = reactive({
  activeDate: [],
  selectType: 'week'
});


const registerDisabled = ref(true);
const orderDisabled = ref(true);

const disabledDate = (key, time) => {
  const choiceDate = chooseMap.get(key);
  if (choiceDate) {
    const theDay = dayjs(choiceDate);
    const minTime = theDay.subtract(1, 'month');
    const maxTime = theDay.add(1, 'month');
    return  time.getTime() <= minTime.valueOf() || time.getTime() >= maxTime.valueOf()
  }
  return false;
}

const calendarChangeHandler = (key, dateList) => {
  const minDate = dateList[0]
  const maxDate = dateList[1]
  chooseMap.set(key, minDate.getTime());
  if (maxDate) {
    chooseMap.set(key, undefined);
  }
}

const queryOrderHandler = (value) => {
  if (value === 'custom') {
    orderDisabled.value = false;
    orderParams.activeDate = [];
  } else if (value === 'week') {
    orderParams.activeDate = getWeekDate();
  } else if (value === 'year') {
    orderParams.activeDate = getYearDate();
  } else if (value === 'month') {
    orderParams.activeDate = getMonthDate();
  }
  getDayOrderData();
}

const queryRegisterHandler = (value) => {
  if (value === 'custom') {
    registerDisabled.value = false;
    registerParams.activeDate = [];
  } else if (value === 'week') {
    registerParams.activeDate = getWeekDate();
  } else if (value === 'year') {
    registerParams.activeDate = getYearDate();
  } else if (value === 'month') {
    registerParams.activeDate = getMonthDate();
  }
  getDayRegisterData();
}

const getDayOrderData = () => {
  const activeDate = orderParams.activeDate;
  if (activeDate && activeDate.length > 0) {
    orderParams.startDate = activeDate[0];
    orderParams.endDate = activeDate[1];
    dayOrderApi(orderParams).then(res => {
      orderOption(res.data);
    })
  }
}

const getDayRegisterData = () => {
  const activeDate = registerParams.activeDate;
  if (activeDate && activeDate.length > 0) {
    registerParams.startDate = activeDate[0];
    registerParams.endDate = activeDate[1];
    dayRegisterApi(registerParams).then(res => {
      registerOption(res.data);
    })
  }
}

const getWeekDate = () => {
  return [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')];
}

const getMonthDate = () => {
  return [dayjs().subtract(1, 'month').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')];
}

const getYearDate = () => {
  return [dayjs().subtract(1, 'year').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')];
}


onMounted(() => {
  const weekDate = getWeekDate();
  registerParams.activeDate = weekDate;
  orderParams.activeDate = weekDate;
  orderChart = echarts.init(document.getElementById('orderApp'));
  registerChart = echarts.init(document.getElementById('registerApp'));
  getDayOrderData();
  getDayRegisterData();
})
</script>
<style lang="scss" scoped>
.item-layout {
  padding: 10px;
}
</style>