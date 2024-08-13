<template>
  <el-col :span="props.span" class="item-layout">
    <div class="item-card" :style="{ height: props.height + 'px'}">
      <div class="item-header">
        <div class="item-title">
          <span class="item-icon" >
            <template v-if="$slots.icon">
              <slot name="icon"></slot>
            </template>
            <template v-else>
              <UserList />
            </template>
          </span>
          <span>{{props.title}}</span>
        </div>
        <div class="item-action">
          <div style="display: flex; justify-content:center; align-items: center">
            <slot name="action"></slot>
            <el-radio-group style="margin-right: 20px" v-model="selectType" @change="queryHandler">
              <el-radio-button value="week">周</el-radio-button>
              <el-radio-button value="month">月</el-radio-button>
              <el-radio-button value="year">年</el-radio-button>
              <el-radio-button value="custom">自定义</el-radio-button>
            </el-radio-group>
            <el-date-picker v-model="activeDate" :disabled="disabled" type="daterange" value-format="YYYY-MM-DD" class="w220" :disabled-date="(time) => disabledDate('product', time)" @calendar-change="calendarChangeHandler('product', $event)" @change="reloadData"></el-date-picker>
          </div>
        </div>
      </div>
      <div class="item-content">
        <slot name="content"></slot>
      </div>
    </div>
  </el-col>
</template>
<script setup>
import UserList from '@/components/icon/Member.vue'
import dayjs from 'dayjs'

const chooseMap = new Map();

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

const props = defineProps({
  span: {
    type: Number,
    default: 12
  },
  title: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    default: 250
  }
});

const disabled = ref(true);

const emit = defineEmits(['reload'])

const selectType = defineModel("selectType", {
  type: String,
  default: 'week'
})

const activeDate = defineModel("activeDate", {
  type: Array,
  default: () => []
})

const reloadData = () => {
  emit('reload');
}

const queryHandler = (value) => {
  disabled.value = true;
  if (value === 'custom') {
    disabled.value = false;
    activeDate.value = [];
  } else if (value === 'week') {
    activeDate.value = getWeekDate();
  } else if (value === 'year') {
    activeDate.value = getYearDate();
  } else if (value === 'month') {
    activeDate.value = getMonthDate();
  }
  reloadData();
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

</script>
<style lang="scss" scoped>
.item-card {
  box-sizing: border-box;
  border: 1px solid #eee;
  width: 100%;
  .item-header {
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    padding: 10px;
    height: 50px;
    border-bottom: 1px solid #eee;
    .item-title {
      font-weight: bold;
      font-size: 15px;
      color: #333333;
      height: 30px;
      line-height: 30px;
      display: flex;
      .item-icon {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .item-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 50px);
    span {
      font-weight: 600;
      color: #333;
      font-size: 30px;
    }
  }
}

</style>