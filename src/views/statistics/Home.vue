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
      <StatisticsChart title="订单量" :height="350" :span="24">
        <template #icon><Line></Line></template>
        <template #action>
          <el-date-picker v-model="orderParams.activeDate" type="daterange" value-format="YYYY-MM-DD" class="w220" @change="getDayOrderData" ></el-date-picker>
        </template>
        <template #content>
          <div id="orderApp" style="width: 100%; height: 100%;"></div>
        </template>
      </StatisticsChart>
    </el-row>
    <el-row>
      <StatisticsChart title="注册量" :height="300" :span="24">
        <template #icon>
          <UserList></UserList>
        </template>
        <template #action>
          <el-date-picker type="daterange" value-format="YYYY-MM-DD" class="w220" @change="getDayRegisterData"></el-date-picker>
        </template>
        <template #content>
          <div id="registerApp" style="width: 100%; height: 100%;"></div>
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


// 注册必须的组件
echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, BarChart, LabelLayout, UniversalTransition, CanvasRenderer, ToolboxComponent, LegendComponent]);

const orderParams = reactive({
  activeDate: []
});


const orderOption = (dataList) => {
  orderChart.setOption({
    color: ['#9dd3e8', '#fc8452'],
    grid: {
      left: '4%',
      right: '5%',
      bottom: '10%'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['订单数量', '订单金额']
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
        name: '订单数量',
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
        name: '订单金额',
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
        name: '订单数量',
        type: 'bar',
        yAxisIndex: 0,
        data: dataList.map(item => item.orderNum)
      },
      {
        yAxisIndex: 1,
        name: '订单金额',
        type: 'line',
        smooth: true,
        data: dataList.map(item => item.payAmount)
      }
    ]
  });
}


const registerOption = (dataList) => {
  registerChart.setOption({
    color: ['#9dd3e8', '#fc8452'],
    grid: {
      left: '4%',
      right: '5%',
      bottom: '10%'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['订单数量', '订单金额']
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
        name: '订单数量',
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
        name: '订单金额',
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
        name: '订单数量',
        type: 'bar',
        yAxisIndex: 0,
        data: dataList.map(item => item.orderNum)
      },
      {
        yAxisIndex: 1,
        name: '订单金额',
        type: 'line',
        smooth: true,
        data: dataList.map(item => item.payAmount)
      }
    ]
  });
}

const getDayOrderData = () => {
  const activeDate = orderParams.activeDate;
  if (activeDate.length > 0) {
    orderParams.startDate = activeDate[0];
    orderParams.endDate = activeDate[1];
  }
  dayOrderApi(orderParams).then(res => {
    orderOption(res.data);
  })
}

const registerParams = reactive({
  activeDate: []
});

const getDayRegisterData = () => {
  const activeDate = registerParams.activeDate;
  if (activeDate.length > 0) {
    registerParams.startDate = activeDate[0];
    registerParams.endDate = activeDate[1];
  }
  dayRegisterApi(registerParams).then(res => {
    registerOption(res.data);
  })
}

let orderChart;
let registerChart;
onMounted(() => {
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