<template>
  <div class="edit-content">
    <el-divider/>
    <div style="float: right; z-index: 10000;">
      <el-radio-group style="margin-bottom: 10px" v-model="radioValue" @change="changeMonth">
        <el-radio-button value="last">上一月</el-radio-button>
        <el-radio-button value="now">今日</el-radio-button>
        <el-radio-button value="next">下一月</el-radio-button>
      </el-radio-group>
    </div>
    <div style="clear: both;">
      <el-tabs  type="card" v-model="activeDay">
        <el-tab-pane v-for="(item, index) in dayList" :label="item" :key="index" :name="item" >{{ item }}</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import dayjs from "dayjs";
const dayList = ref([]);
const activeDay = ref(dayjs().format("YYYY-MM-DD"));
const radioValue = ref("now")

onMounted(() => {
  generateDayList(dayjs());
})

const changeMonth = (value) => {
  console.log(value)
}

const generateDayList = (date) => {
  const startDay = date.startOf('month');
  const endDay = date.endOf('month');
  const day = endDay.diff(startDay, 'day') + 1;
  for (let i = 1; i <= day; i++) {
    dayList.value.push(date.date(i).format("YYYY-MM-DD"));
  }
}
</script>

