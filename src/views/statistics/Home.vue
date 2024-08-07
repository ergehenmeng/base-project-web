<template>
  <div class="edit-content">
    <el-divider />
    <el-row>
      <el-col :span="6" class="item-layout">
        <div class="item-card">
          <div class="item-header">
            <div class="item-title">注册数</div>
            <div class="item-search"><el-date-picker type="daterange" value-format="YYYY-MM-DD" class="w220"></el-date-picker></div>
          </div>
          <div class="item-content">
            <span>FS</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="item-layout">
        <div class="item-card">
          <div class="item-header">
            <div class="item-title">浏览量</div>
            <div></div>
          </div>
          <div class="item-content">
            <span></span>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="item-layout">
        <div class="item-card">
          <div class="item-header">
            <div class="item-title">收藏量</div>
            <div></div>
          </div>
          <div class="item-content">
            <span></span>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="item-layout">
        <div class="item-card">
          <div class="item-header">
            <div class="item-title">新增商品数</div>
            <div></div>
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
}

</style>