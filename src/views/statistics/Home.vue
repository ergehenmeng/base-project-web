<template>
  <div class="edit-content">
    <el-divider />
    <el-row>
      <StatisticsCard title="累计订单数" amount="321,123">
        <OrderNum :size="50"></OrderNum>
      </StatisticsCard>
      <StatisticsCard title="累计订单金额" amount="321,123">
        <OrderAmount :size="50"></OrderAmount>
      </StatisticsCard>
      <StatisticsCard title="累计退单数" amount="321,123">
        <RefundNum :size="50"></RefundNum>
      </StatisticsCard>
      <StatisticsCard title="累计退款金额" amount="321,123">
        <RefundAmount :size="50"></RefundAmount>
      </StatisticsCard>
    </el-row>
    <el-row>
      <el-col :span="16" class="item-layout">
        <div class="item-card">
          <div class="item-header">
            <div class="item-title">注册人数</div>
          </div>
          <div class="item-content">
            <span></span>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="item-layout">
        <div class="item-card">
          <div class="item-header">
            <div class="item-title">注册人数</div>
          </div>
          <div class="item-content">
            <span></span>
          </div>
        </div>
      </el-col>
    </el-row>
    <div id="homeApp" style="width: 300px; height: 300px;"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { DatasetComponent, GridComponent, TitleComponent, TooltipComponent, TransformComponent } from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import OrderNum from '@/components/icon/OrderNum.vue'
import StatisticsCard from '@/components/StatisticsCard.vue'
import OrderAmount from '@/components/icon/OrderAmount.vue'
import RefundNum from '@/components/icon/RefundNum.vue'
import RefundAmount from '@/components/icon/RefundAmount.vue'

// 注册必须的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, BarChart, LabelLayout, UniversalTransition, CanvasRenderer]);
nextTick(() => {
  const chart = echarts.init(document.getElementById('homeApp'));
  chart.setOption({
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  });
})
</script>
<style lang="scss" scoped>
.item-layout {
  padding: 10px;
  .item-card {
    border: 1px solid #ddd;
    width: 100%;
    height: 200px;
    .item-header {
      display: flex;
      background-color: #fff;
      justify-content: space-between;
      padding: 10px;
      height: 50px;
      border-bottom: 1px solid #ddd;
      .item-title {
        font-weight: bold;
        font-size: 15px;
        height: 30px;
        line-height: 30px;
      }
    }
    .item-content {
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-weight: 600;
        color: #333;
        font-size: 30px;
      }
    }
  }
  .item-block {
    border: 1px solid #ddd;
    width: 100%;
    height: 100px;
    display: flex;
    padding: 20px;
    justify-content: left;
    align-items: center;
    .item-icon {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    .item-box {
      .item-box-title {
        color: #333333;
        font-size: 12px;
        display: block;
      }
      .item-box-content {
        color: #222;
        margin-top: 5px;
        font-size: 25px;
        display: block;
      }
    }
  }
}

</style>