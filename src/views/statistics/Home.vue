<template>
  <div class="edit-content">
    <el-divider />
    <el-row>
      <StatisticsCard title="累计订单数" :amount="orderValue.orderNum">
        <PayNum :size="50"></PayNum>
      </StatisticsCard>
      <StatisticsCard title="累计订单金额" :amount="orderValue.payAmount" :precision="2">
        <PayAmount :size="50"></PayAmount>
      </StatisticsCard>
      <StatisticsCard title="累计退单数" :amount="orderValue.refundNum">
        <RefundNum :size="50"></RefundNum>
      </StatisticsCard>
      <StatisticsCard title="累计退款金额" :amount="orderValue.refundAmount" :precision="2">
        <RefundAmount :size="50"></RefundAmount>
      </StatisticsCard>
    </el-row>
    <el-row>
      <StatisticsChart title="注册统计" :height="300" :span="16" @reload="getDayRegisterData" v-model:active-date="registerParams.activeDate" v-model:select-type="registerParams.selectType">
        <template #icon>
          <Member></Member>
        </template>
        <template #content>
          <div id="registerApp" style="width: 100%; height: 100%"></div>
        </template>
      </StatisticsChart>
      <StatisticsChart title="注册渠道" :height="300" :span="8" :hidden-query="true">
        <template #icon>
          <Channel></Channel>
        </template>
        <template #content>
          <div id="channelApp" style="width: 100%; height: 100%"></div>
        </template>
      </StatisticsChart>
    </el-row>
    <el-row>
      <StatisticsChart title="订单统计" :height="350" :span="24" v-model:active-date="orderParams.activeDate" v-model:select-type="orderParams.selectType" @reload="getDayOrderData">
        <template #icon><Order></Order></template>
        <template #content>
          <div id="orderApp" style="width: 100%; height: 100%"></div>
        </template>
      </StatisticsChart>
    </el-row>
    <el-row>
      <StatisticsChart title="新增商品" :height="300" :span="24" @reload="getDayProductData" v-model:select-type="productParams.selectType" v-model:active-date="productParams.activeDate">
        <template #icon>
          <Product></Product>
        </template>
        <template #action>
          <el-select placeholder="商品类型" v-model="productParams.productType" clearable class="w120" style="margin-right: 20px;" @change="getDayProductData">
            <el-option label="零售" value="item" />
            <el-option label="门票" value="ticket" />
            <el-option label="民宿" value="homestay" />
            <el-option label="餐饮" value="voucher" />
            <el-option label="场馆" value="venue" />
            <el-option label="线路" value="line" />
          </el-select>
        </template>
        <template #content>
          <div id="productApp" style="width: 100%; height: 100%"></div>
        </template>
      </StatisticsChart>
    </el-row>
    <el-row>
      <StatisticsChart title="加购统计" :height="300" :span="24" @reload="getDayCartData" v-model:select-type="cartParams.selectType" v-model:active-date="cartParams.activeDate" >
        <template #icon>
          <Cart></Cart>
        </template>
        <template #content>
          <div id="cartApp" style="width: 100%; height: 100%"></div>
        </template>
      </StatisticsChart>
    </el-row>
    <el-row>
      <StatisticsChart title="浏览量" :height="300" :span="24" @reload="getDayVisitData" v-model:select-type="visitParams.selectType" v-model:active-date="visitParams.activeDate">
        <template #icon>
          <Visit></Visit>
        </template>
        <template #action>
          <el-select placeholder="访问类型" v-model="visitParams.visitType" clearable class="w120" style="margin-right: 20px;" @change="getDayVisitData">
            <el-option label="首页" :value="1" />
            <el-option label="个人中心" :value="2" />
            <el-option label="商品列表" :value="3" />
            <el-option label="商品详情" :value="4" />
            <el-option label="购物车" :value="5" />
            <el-option label="营销中心" :value="6" />
            <el-option label="活动中心" :value="7" />
            <el-option label="资讯详情" :value="8" />
            <el-option label="订单详情" :value="9" />
          </el-select>
        </template>
        <template #content>
          <div id="visitApp" style="width: 100%; height: 100%"></div>
        </template>
      </StatisticsChart>
    </el-row>
    <el-row>
      <StatisticsChart title="收藏量" :height="300" :span="24" @reload="getDayCollectData" v-model:select-type="collectParams.selectType" v-model:active-date="collectParams.activeDate">
        <template #icon>
          <Collect></Collect>
        </template>
        <template #action>
          <el-select placeholder="访问类型" v-model="collectParams.collectType" clearable class="w120" style="margin-right: 20px;" @change="getDayCollectData">
            <el-option label="景区" :value="1" />
            <el-option label="民宿" :value="2" />
            <el-option label="零售门店" :value="3" />
            <el-option label="零售商品" :value="4" />
            <el-option label="线路商品" :value="5" />
            <el-option label="餐饮门店" :value="6" />
            <el-option label="资讯" :value="7" />
            <el-option label="旅行社" :value="8" />
          </el-select>
        </template>
        <template #content>
          <div id="collectApp" style="width: 100%; height: 100%"></div>
        </template>
      </StatisticsChart>
    </el-row>
  </div>
</template>

<script setup>
import { sexChannelApi, dayRegisterApi, orderApi, dayOrderApi, dayAppendApi, dayCartApi, dayVisitApi, dayCollectApi } from '@/api/home/statistics';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { DatasetComponent, GridComponent, TitleComponent, TooltipComponent, TransformComponent, ToolboxComponent, LegendComponent } from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import RefundNum from '@/components/icon/RefundNum.vue'
import StatisticsCard from '@/components/StatisticsCard.vue'
import PayAmount from '@/components/icon/PayAmount.vue'
import PayNum from '@/components/icon/PayNum.vue'
import RefundAmount from '@/components/icon/RefundAmount.vue'
import StatisticsChart from '@/components/StatisticsChart.vue'
import Member from '@/components/icon/Member.vue'
import dayjs from "dayjs";
import Product from '@/components/icon/Product.vue'
import Cart from "@/components/icon/Cart.vue";
import Order from "@/components/icon/Order.vue";
import Visit from '@/components/icon/Visit.vue'
import Channel from '@/components/icon/Channel.vue'
import Collect from '@/components/icon/Collect.vue'

// 注册必须的组件
echarts.use([ PieChart, LineChart, TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, BarChart, LabelLayout, UniversalTransition, CanvasRenderer, ToolboxComponent, LegendComponent]);

let orderChart;
let registerChart;
let productChart;
let cartChart;
let visitChart;
let collectChart;
let channelChart;

const orderOption = (dataList) => {
  orderChart.setOption({
    color: ['#2ed5cf', '#fa4e06'],
    grid: {
      left: '4%',
      right: '5%',
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
        data: orderParams.selectType === 'year' ? dataList.map(item => item.createMonth) : dataList.map(item => item.createDate)
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
        barWidth: '40%',
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
      left: '6%',
      right: '5%',
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
        data: registerParams.selectType === 'year' ? dataList.map(item => item.createMonth) : dataList.map(item => item.createDate)
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

const productOption = (dataList) => {
  productChart.setOption({
    grid: {
      left: '4%',
      right: '5%',
      bottom: '10%'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['商品数']
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: productParams.selectType === 'year' ? dataList.map(item => item.createMonth) : dataList.map(item => item.createDate)
      }
    ],
    yAxis: {
      type: 'value',
      position: 'left',
      name: '商品数',
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
        name: '商品数',
        type: 'line',
        smooth: true,
        color: '#ae3af3',
        data: dataList.map(item => item.appendNum)
      }
    ]
  });
}

const cartOption = (dataList) => {
  cartChart.setOption({
    grid: {
      left: '4%',
      right: '5%',
      bottom: '10%'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['加购商品数']
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: cartParams.selectType === 'year' ? dataList.map(item => item.createMonth) : dataList.map(item => item.createDate)
      }
    ],
    yAxis: {
      type: 'value',
      position: 'left',
      name: '加购商品数',
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
        name: '加购商品数',
        type: 'bar',
        barWidth: '30%',
        color: '#fbcd33',
        data: dataList.map(item => item.cartNum)
      }
    ]
  });
}

const visitOption = (dataList) => {
  visitChart.setOption({
    grid: {
      left: '4%',
      right: '5%',
      bottom: '10%'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['访问量']
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: visitParams.selectType === 'year' ? dataList.map(item => item.createMonth) : dataList.map(item => item.createDate)
      }
    ],
    yAxis: {
      type: 'value',
      position: 'left',
      name: '访问量',
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
        name: '访问量',
        type: 'line',
        areaStyle: {},
        smooth: true,
        color: '#68ec82',
        data: dataList.map(item => item.visitNum)
      }
    ]
  });
}

const collectOption = (dataList) => {
  collectChart.setOption({
    grid: {
      left: '4%',
      right: '5%',
      bottom: '10%'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['收藏量']
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: collectParams.selectType === 'year' ? dataList.map(item => item.createMonth) : dataList.map(item => item.createDate)
      }
    ],
    yAxis: {
      type: 'value',
      position: 'left',
      name: '收藏量',
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
        name: '收藏量',
        type: 'line',
        smooth: true,
        areaStyle: {},
        color: '#70a1ff',
        data: dataList.map(item => item.collectNum)
      }
    ]
  });
}

const channelOption = (data) => {
  channelChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'middle',
      left: '8%',
      orient: 'vertical'
    },
    series: [
      {
        name: '性别分布',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],
        center: ['55%', '50%'],
        labelLine: {
          show: false
        },
        label: {
          position: 'inner',
          fontSize: 14
        },
        data: data.sexList
      },
      {
        name: '注册渠道',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['55%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: data.channelList
      }
    ]
  });
}

const orderParams = reactive({
  activeDate: [],
  selectType: 'week'
});

const registerParams = reactive({
  activeDate: [],
  selectType: 'week'
});

const productParams = reactive({
  activeDate: [],
  selectType: 'week',
  productType: null
});

const cartParams = reactive({
  activeDate: [],
  selectType: 'week'
});

const visitParams = reactive({
  activeDate: [],
  selectType: 'week',
  visitType: null
});

const collectParams = reactive({
  activeDate: [],
  selectType: 'week',
  collectType: 1
});

const getDayCartData = () => {
  const activeDate = cartParams.activeDate;
  if (activeDate && activeDate.length > 0) {
    cartParams.startDate = activeDate[0];
    cartParams.endDate = activeDate[1];
    dayCartApi(cartParams).then(res => {
      cartOption(res.data);
    })
  }
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

const getDayVisitData = () => {
  const activeDate = visitParams.activeDate;
  if (activeDate && activeDate.length > 0) {
    visitParams.startDate = activeDate[0];
    visitParams.endDate = activeDate[1];
    dayVisitApi(visitParams).then(res => {
      visitOption(res.data);
    })
  }
}

const getDayCollectData = () => {
  const activeDate = collectParams.activeDate;
  if (activeDate && activeDate.length > 0) {
    collectParams.startDate = activeDate[0];
    collectParams.endDate = activeDate[1];
    dayCollectApi(collectParams).then(res => {
      collectOption(res.data);
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

const getDayProductData = () => {
  const activeDate = productParams.activeDate;
  if (activeDate && activeDate.length > 0) {
    productParams.startDate = activeDate[0];
    productParams.endDate = activeDate[1];
    dayAppendApi(productParams).then(res => {
      productOption(res.data);
    })
  }
}

const getDayChannelData = () => {
  sexChannelApi({}).then(res => {
    channelOption(res.data);
  })
}

const getWeekDate = () => {
  return [dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')];
}

const orderValue = ref({
  orderNum: 0,
  orderAmount: "0",
  refundNum: 0,
  refundAmount: "0"
})

onMounted(() => {
  orderApi().then(res => {
    orderValue.value = {...res.data};
  })

  const weekDate = getWeekDate();
  registerParams.activeDate = weekDate;
  orderParams.activeDate = weekDate;
  productParams.activeDate = weekDate;
  cartParams.activeDate = weekDate;
  visitParams.activeDate = weekDate;
  collectParams.activeDate = weekDate;
  orderChart = echarts.init(document.getElementById('orderApp'));
  registerChart = echarts.init(document.getElementById('registerApp'));
  productChart = echarts.init(document.getElementById('productApp'));
  cartChart = echarts.init(document.getElementById('cartApp'));
  visitChart = echarts.init(document.getElementById('visitApp'));
  collectChart = echarts.init(document.getElementById('collectApp'));
  channelChart = echarts.init(document.getElementById('channelApp'));
  getDayChannelData();
  getDayOrderData();
  getDayRegisterData();
  getDayProductData();
  getDayCartData();
  getDayVisitData();
  getDayCollectData();
})
</script>
<style lang="scss" scoped>
.item-layout {
  padding: 10px;
}
</style>