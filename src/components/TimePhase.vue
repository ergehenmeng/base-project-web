<template>
  <div>
    <div class="item-title">
      <div class="item">06:00</div>
      <div class="item">07:00</div>
      <div class="item">08:00</div>
      <div class="item">09:00</div>
      <div class="item">10:00</div>
      <div class="item">11:00</div>
      <div class="item">12:00</div>
      <div class="item">13:00</div>
      <div class="item">14:00</div>
      <div class="item">15:00</div>
      <div class="item">16:00</div>
      <div class="item">17:00</div>
      <div class="item">18:00</div>
      <div class="item">19:00</div>
      <div class="item">20:00</div>
      <div class="item">21:00</div>
      <div class="item">22:00</div>
      <div class="item">23:00</div>
      <div class="item">24:00</div>
    </div>
    <div class="item-content" ref="mainContentRef">
      <div class="item" data="06:00" @click="selectHandle('06:00', $event)"></div>
      <div class="item" data="06:30" @click="selectHandle('06:30', $event)"></div>
      <div class="item" data="07:00" @click="selectHandle('07:00', $event)"></div>
      <div class="item" data="07:30" @click="selectHandle('07:30', $event)"></div>
      <div class="item" data="08:00" @click="selectHandle('08:00', $event)"></div>
      <div class="item" data="08:30" @click="selectHandle('08:30', $event)"></div>
      <div class="item" data="09:00" @click="selectHandle('09:00', $event)"></div>
      <div class="item" data="09:30" @click="selectHandle('09:30', $event)"></div>
      <div class="item" data="10:00" @click="selectHandle('10:00', $event)"></div>
      <div class="item" data="10:30" @click="selectHandle('10:30', $event)"></div>
      <div class="item" data="11:00" @click="selectHandle('11:00', $event)"></div>
      <div class="item" data="11:30" @click="selectHandle('11:30', $event)"></div>
      <div class="item" data="12:00" @click="selectHandle('12:00', $event)"></div>
      <div class="item" data="12:30" @click="selectHandle('12:30', $event)"></div>
      <div class="item" data="13:00" @click="selectHandle('13:00', $event)"></div>
      <div class="item" data="13:30" @click="selectHandle('13:30', $event)"></div>
      <div class="item" data="14:00" @click="selectHandle('14:00', $event)"></div>
      <div class="item" data="14:30" @click="selectHandle('14:30', $event)"></div>
      <div class="item" data="15:00" @click="selectHandle('15:00', $event)"></div>
      <div class="item" data="15:30" @click="selectHandle('15:30', $event)"></div>
      <div class="item" data="16:00" @click="selectHandle('16:00', $event)"></div>
      <div class="item" data="16:30" @click="selectHandle('16:30', $event)"></div>
      <div class="item" data="17:00" @click="selectHandle('17:00', $event)"></div>
      <div class="item" data="17:30" @click="selectHandle('17:30', $event)"></div>
      <div class="item" data="18:00" @click="selectHandle('18:00', $event)"></div>
      <div class="item" data="18:30" @click="selectHandle('18:30', $event)"></div>
      <div class="item" data="19:00" @click="selectHandle('19:00', $event)"></div>
      <div class="item" data="19:30" @click="selectHandle('19:30', $event)"></div>
      <div class="item" data="20:00" @click="selectHandle('20:00', $event)"></div>
      <div class="item" data="20:30" @click="selectHandle('20:30', $event)"></div>
      <div class="item" data="21:00" @click="selectHandle('21:00', $event)"></div>
      <div class="item" data="21:30" @click="selectHandle('21:30', $event)"></div>
      <div class="item" data="22:00" @click="selectHandle('22:00', $event)"></div>
      <div class="item" data="22:30" @click="selectHandle('22:30', $event)"></div>
      <div class="item" data="23:00" @click="selectHandle('23:00', $event)"></div>
      <div class="item" data="23:30" @click="selectHandle('23:30', $event)"></div>
      <div style="display: flex; justify-content: center; margin-left: 10px;" v-show="!props.disabled">
        <el-button type="primary" link :icon="Refresh" title="重置价格配置" @click="resetConfig"></el-button>
      </div>
    </div>
    <TimePhaseDialog ref="dialogRef" @reload="addPhasePrice" @cancel="cancelChecked"></TimePhaseDialog>
    <el-popover
        :virtual-ref="popoverRef"
        trigger="hover"
        placement="top"
        :visible="visible"
        virtual-triggering width="150">
      <template #default>
        <div style="width:130px; display: flex; justify-content: center; align-items: center;">
          <div>
            <p class="tips-content">
              <span class="label-title">时间段:</span><span>{{ startRef }}~{{ endRef }}</span>
            </p>
            <p class="tips-content">
              <span class="label-title">价格:</span><span>{{ priceRef }}</span>
            </p>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>
<script setup>
import dayjs from "dayjs";
import {confirmMsg, errorMsg} from "@/utils/message.js";
import TimePhaseDialog from "@/components/TimePhaseDialog.vue";
import {Refresh} from "@element-plus/icons-vue";

const popoverRef = ref();
const dialogRef = ref();
const startRef = ref('');
const endRef = ref('');
const priceRef = ref('')
const mainContentRef = ref();
const start = ref('');
const end = ref('');
const startItem = ref();
const endItem = ref();
const checkedItems = ref([]);
const visible = ref(false);
// true:正向 false:反向
const sequence = ref(true);

const selectHandle = (value, event) => {
  if (!event.target.classList.contains("item") || event.target.classList.contains('checked')) {
    return;
  }
  if (!start.value && !end.value) {
    start.value = value;
    startItem.value = event.target;
    event.target.classList.add('active')
  } else if (!end.value) {
    const { startTime, endTime } = calcValidFrom(start.value, value);
    start.value = startTime;
    end.value = endTime;
    const range = activeRange(startTime, endTime, event);
    if (range) {
      dialogRef.value.openDialog(startTime, endTime);
    }
  } else {
    clear(event);
    start.value = value;
    event.target.classList.add('active')
  }
}

const clear = (event) => {
  event.target.parentNode.childNodes.forEach(item => {
    item.classList.remove('active')
  })
}

const activeRange = (startTime, endTime, endEvent) => {
  const startDate = dayjs("2018-04-25 " + startTime, "YYYY-MM-DD HH:mm");
  const endDate = dayjs("2018-04-25 " + endTime, "YYYY-MM-DD HH:mm");
  const diff = endDate.diff(startDate, 'minute');
  const range = Math.abs(diff) / 30;
  const items = [];
  let startElement;
  let endElement;
  for (let i = 0; i < range; i++) {
    let time = startDate.add(i * 30, 'minute').format("HH:mm");
    const item = endEvent.target.parentNode.querySelector(`[data="${time}"]`);
    if (i === 0) {
      startElement = item;
    }
    if (i === range - 1) {
      endElement = item;
    }
    const contains = item.classList.contains("checked");
    if (contains) {
      errorMsg("时间段已被占用");
      return false;
    }
    items.push(item)
  }
  items.forEach(item => {
    item.classList.add('checked')
    item.classList.remove("active");
  })
  checkedItems.value = items;
  endElement.classList.add("right");
  startItem.value = startElement;
  endItem.value = endElement;
  return true;
}

const addPhasePrice = (price) => {
  phaseList.value.push({
    startTime: start.value,
    endTime: end.value,
    price: price
  })
  const length = checkedItems.value.length;
  if (length !== 1) {
    checkedItems.value.forEach((item, index) => {
      if (index === 0) {
        item.style.width = 30 * length + "px";
        if (length >= 4) {
          addChildTips(item, start.value, end.value, price);
        } else {
          addTips(item, start.value, end.value, price);
        }
      } else {
        item.style.width = "0px";
      }
    });
  } else {
    const item = checkedItems.value[0]
    item.style.width = 30 * length + "px";
    addTips(item, start.value, end.value, price);
  }
  reset();
}

const addChildTips = (item, startTime, endTime, price) => {
  item.innerHTML = generateHtml(price);
  bindDeleteEvent(item, item.childNodes[0], startTime, endTime);
}

const addTips = (item, startTime, endTime, price) => {

  const mouseenterEvent = () => {
    popoverRef.value = item;
    startRef.value = startTime
    endRef.value = endTime
    priceRef.value = parseFloat(price).toFixed(2);
    visible.value = true;
  }
  const mouseleaveEvent = () => {
    visible.value = false;
  }

  item.addEventListener("mouseenter", mouseenterEvent)
  item.addEventListener("mouseleave", mouseleaveEvent)

  const element = document.createElement("div");
  element.style.width = "100%";
  element.style.height = "100%";
  item.appendChild(element);
  bindDeleteEvent(item, element, startTime, endTime, mouseenterEvent, mouseleaveEvent);
}

const bindDeleteEvent = (parent, item, startTime, endTime, mouseenterEvent, mouseleaveEvent) => {
  item.addEventListener("click", () => {
    confirmMsg(`确定要删除 ${startTime}~${endTime} 时间的价格配置吗?`, () => {
      parent.removeChild(item);
      const data = parent.getAttribute("data");
      const length = parseInt(parent.style.width.split("px")[0]) / 30;
      if (data === startTime) {
        resetAfter(parent, length)
      } else {
        resetBefore(parent, length);
      }
      if (mouseenterEvent) {
        parent.removeEventListener("mouseenter", mouseenterEvent);
      }
      if (mouseleaveEvent) {
        parent.removeEventListener("mouseleave", mouseleaveEvent);
      }
    });
  });
  return () => parent.removeChild(item);
}

const resetAfter = (item, length) => {
  let next = item;
  while (length-- > 0 && next) {
    next.style.width = "30px";
    next.classList.remove("checked");
    next.classList.remove("right");
    checkedItems.value = checkedItems.value.filter(i => i !== next);
    next = next.nextSibling;
  }

}

const resetBefore = (item, length) => {
  let before = item;
  while (length-- > 0 && before) {
    before.style.width = "30px";
    before.classList.remove("checked");
    before.classList.remove("right");
    before = before.previousSibling;
    checkedItems.value = checkedItems.value.filter(i => i !== before);
  }
}

const resetConfig = () => {
  confirmMsg("确定要重置价格配置吗?", () => {
    mainContentRef.value.childNodes.forEach(item => {
      item.classList.remove("checked");
      item.classList.remove("right");
      item.style.width = "30px";
      start.value = null;
      end.value = null;
      item.innerHTML = "";
      startItem.value = null;
      endItem.value = null;
      checkedItems.value = [];
      phaseList.value = [];
    })
  })
}

const calcPhase = (start, end, sequence) => {
  let startTime;
  let endTime;
  if (sequence) {
    startTime = start;
    endTime = realEndTime(end);
  } else {
    startTime = end;
    endTime = realEndTime(start);
  }
  return {startTime, endTime};
}

const calcValidFrom = (start, end) => {
  const startDate = dayjs("2018-04-25 " + start, "YYYY-MM-DD HH:mm");
  const endDate = dayjs("2018-04-25 " + end, "YYYY-MM-DD HH:mm");
  let startTime;
  let endTime;
  if (startDate.isBefore(endDate)) {
    startTime = start;
    endTime = endDate.add(30, 'minute').format("HH:mm");
  } else {
    startTime = end;
    endTime = startDate.add(30, 'minute').format("HH:mm");
  }
  return {startTime, endTime};
}

const generateHtml = (price) => {
  const formatPrice = parseFloat(price).toFixed(2);
  const {startTime, endTime} = calcPhase(start.value, end.value, sequence.value);

  return `<div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;" ><div style="pointer-events: none;">
        <p class="tips-content">
          <span class="label-title">时间段:</span><span>${startTime}~${endTime}</span>
        </p>
        <p class="tips-content">
          <span class="label-title">价格:</span><span>${formatPrice}</span>
        </p>
      </div></div>`
}

const realEndTime = (endTime) => {
  const startDate = dayjs("2018-04-25 " + endTime, "YYYY-MM-DD HH:mm");
  const endDate = startDate.add(30, 'minute')
  return endDate.format("HH:mm");
}


const cancelChecked = () => {
  const startDate = dayjs("2018-04-25 " + start.value, "YYYY-MM-DD HH:mm");
  const endDate = dayjs("2018-04-25 " + end.value, "YYYY-MM-DD HH:mm");
  const diff = endDate.diff(startDate, 'minute');
  const range = Math.abs(diff) / 30 + 1;
  for (let i = 0; i < range; i++) {
    let time;
    if (diff < 0) {
      time = startDate.subtract(i * 30, 'minute').format("HH:mm");
    } else {
      time = startDate.add(i * 30, 'minute').format("HH:mm");
    }
    const item = endItem.value.parentNode.querySelector(`[data="${time}"]`);
    if (item) {
      item.classList.remove("checked");
    }
  }
  startItem.value.classList.remove("right");
  endItem.value.classList.remove("right");
  reset();
}

const reset = () => {
  start.value = '';
  end.value = '';
  startItem.value = null;
  endItem.value = null;
}

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  }
});

const phaseList = defineModel({
  type: Array,
  default: () => []
});

</script>

<style lang="scss" scoped>
.item-title {
  display: flex;
  flex-wrap: wrap;

  .item {
    text-indent: 5px;
    width: 60px;
    font-size: 12px;
  }
}

.item-content {
  display: flex;
  flex-wrap: wrap;
  margin-left: 20px;

  .item {
    width: 30px;
    height: 60px;
    border-top: 1px solid #cecece;
    border-bottom: 1px solid #cecece;
    box-sizing: border-box;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.03);
    cursor: pointer;
  }

  .item:hover {
    background-color: #cccccc;
  }

  .item:nth-child(2n) {
    border-right: 1px solid #cecece;
  }

  .item:first-child {
    border-left: 1px solid #cecece;
  }

  .item.active {
    box-sizing: border-box;
    background-color: #1e90ff;
  }

  .item.checked {
    background-color: #74b9ff;
    cursor: pointer;
    border: none;
  }

  .item.checked.left {
    border-left: 1px solid #cecece;
  }

  .item.checked.right {
    border-right: 1px solid #cecece;
  }

}


</style>