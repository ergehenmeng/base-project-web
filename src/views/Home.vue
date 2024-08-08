<template>
  <div id="appTest" style="width: 300px; height: 300px;"></div>
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
  const chart = echarts.init(document.getElementById('appTest'));
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
