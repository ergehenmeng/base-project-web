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
      <div style="display: flex; justify-content: center; margin-left: 10px" v-show="!props.disabled" id="reset">
        <el-button type="primary" link :icon="Refresh" title="重置价格配置" @click="resetConfig"></el-button>
      </div>
    </div>
    <TimePhaseDialog ref="dialogRef" @reload="addPhasePrice" @cancel="cancelChecked"></TimePhaseDialog>
    <el-popover :virtual-ref="popoverRef" trigger="hover" placement="top" :visible="visible" virtual-triggering width="150">
      <template #default>
        <div style="width: 130px; display: flex; justify-content: center; align-items: center">
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
import dayjs from 'dayjs';
import { confirmMsg, errorMsg } from '@/utils/message.js';
import TimePhaseDialog from '@/components/TimePhaseDialog.vue';
import { Refresh } from '@element-plus/icons-vue';
import { renderMsg } from '@/utils/common.js'

const popoverRef = ref();
const dialogRef = ref();
const startRef = ref('');
const endRef = ref('');
const priceRef = ref('');
const mainContentRef = ref();
const start = ref('');
const end = ref('');
const startItem = ref();
const endItem = ref();
const checkedItems = ref([]);
const visible = ref(false);
const moveInMap = new Map();
const moveOutMap = new Map();

const selectHandle = (value, event) => {
  if (!event.target.classList.contains('item') || event.target.classList.contains('checked')) {
    return;
  }
  if (!start.value && !end.value) {
    start.value = value;
    startItem.value = event.target;
    event.target.classList.add('active');
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
    end.value = '';
    event.target.classList.add('active');
  }
};

const clear = (event) => {
  event.target.parentNode.childNodes.forEach((item) => {
    item.classList.remove('active');
  });
};
/**
 * 设置选中区间的样式
 * @param startTime 开始时间(包含)
 * @param endTime 截止时间(包含)
 * @param endEvent 当前点击的元素
 * @returns {boolean}  表示选中是否成功
 */
const activeRange = (startTime, endTime, endEvent) => {
  const startDate = dayjs('2018-04-25 ' + startTime, 'YYYY-MM-DD HH:mm');
  let endDate;
  if (endTime === '00:00') {
    endDate = dayjs('2018-04-26 ' + endTime, 'YYYY-MM-DD HH:mm');
  } else {
    endDate = dayjs('2018-04-25 ' + endTime, 'YYYY-MM-DD HH:mm');
  }
  const diff = endDate.diff(startDate, 'minute');
  const range = Math.abs(diff) / 30;
  const items = [];
  let startElement;
  let endElement;
  for (let i = 0; i < range; i++) {
    let time = startDate.add(i * 30, 'minute').format('HH:mm');
    if (time === '00:00') {
      time = '23:30';
    }
    const item = endEvent.target.parentNode.querySelector(`[data="${time}"]`);
    if (i === 0) {
      startElement = item;
    }
    if (i === range - 1) {
      endElement = item;
    }
    const contains = item.classList.contains('checked');
    if (contains) {
      errorMsg('时间段已被占用');
      return false;
    }
    items.push(item);
  }
  items.forEach((item, index) => {
    if (index === 0) {
      item.style.width = 30 * range + 'px';
    } else {
      item.style.width = '0px';
    }
    item.classList.add('checked');
    item.classList.remove('active');
  });
  checkedItems.value = items;
  startItem.value = startElement;
  endItem.value = endElement;
  tryAddBorder(startElement);
  return true;
};

const tryAddBorder = (startElement) => {
  const value = window.getComputedStyle(startElement)['borderRightWidth'];
  if (value === '0px') {
    startElement.classList.add('right');
  }
};

const addPhasePrice = (price) => {
  phaseList.value.push({
    startTime: start.value,
    endTime: end.value,
    price: price
  });
  const length = checkedItems.value.length;
  if (length >= 4) {
    addChildTips(startItem.value, start.value, end.value, price);
  } else {
    addTips(startItem.value, start.value, end.value, price);
  }
  reset();
};

const addChildTips = (item, startTime, endTime, price) => {
  item.innerHTML = generateHtml(startTime, endTime, price);
  bindDeleteEvent(item, item.childNodes[0], startTime, endTime);
};

const addTips = (item, startTime, endTime, price) => {
  const mouseenterEvent = () => {
    popoverRef.value = item;
    startRef.value = startTime;
    endRef.value = endTime;
    priceRef.value = parseFloat(price).toFixed(2);
    visible.value = true;
  };
  const mouseleaveEvent = () => {
    visible.value = false;
  };

  item.addEventListener('mouseenter', mouseenterEvent);
  item.addEventListener('mouseleave', mouseleaveEvent);
  moveInMap.set(item, mouseenterEvent);
  moveOutMap.set(item, mouseleaveEvent);

  const element = document.createElement('div');
  element.style.width = '100%';
  element.style.height = '100%';
  item.appendChild(element);
  bindDeleteEvent(item, element, startTime, endTime, mouseenterEvent, mouseleaveEvent);
};

const bindDeleteEvent = (parent, item, startTime, endTime, mouseenterEvent, mouseleaveEvent) => {
  item.addEventListener('click', () => {
    const msg = renderMsg(["确定要删除", () => `${startTime}~${endTime}`, "时间段的价格配置吗?"]);
    confirmMsg(msg, () => {
      parent.removeChild(item);
      const data = parent.getAttribute('data');
      phaseList.value = phaseList.value.filter((item) => !(item.startTime === startTime && item.endTime === endTime));
      const length = parseInt(parent.style.width.split('px')[0]) / 30;
      if (data === startTime) {
        resetAfter(parent, length);
      } else {
        resetBefore(parent, length);
      }
      if (mouseenterEvent) {
        parent.removeEventListener('mouseenter', mouseenterEvent);
      }
      if (mouseleaveEvent) {
        parent.removeEventListener('mouseleave', mouseleaveEvent);
      }
    });
  });
  return () => parent.removeChild(item);
};

const resetAfter = (item, length) => {
  let next = item;
  while (length-- > 0 && next) {
    next.style.width = '30px';
    next.classList.remove('checked');
    next.classList.remove('right');
    next = next.nextSibling;
  }
};

const resetBefore = (item, length) => {
  let before = item;
  while (length-- > 0 && before) {
    before.style.width = '30px';
    before.classList.remove('checked');
    before.classList.remove('right');
    before = before.previousSibling;
  }
};

const resetConfig = () => {
  confirmMsg('确定要重置价格配置吗?', () => {
    doReset(true);
  });
};

const calcValidFrom = (start, end) => {
  const startDate = dayjs('2018-04-25 ' + start, 'YYYY-MM-DD HH:mm');
  const endDate = dayjs('2018-04-25 ' + end, 'YYYY-MM-DD HH:mm');
  let startTime;
  let endTime;
  if (startDate.isBefore(endDate)) {
    startTime = start;
    endTime = endDate.add(30, 'minute').format('HH:mm');
  } else {
    startTime = end;
    endTime = startDate.add(30, 'minute').format('HH:mm');
  }
  return { startTime, endTime };
};

const generateHtml = (startTime, endTime, price) => {
  const formatPrice = parseFloat(price).toFixed(2);
  return `<div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;" ><div style="pointer-events: none;">
        <p class="tips-content">
          <span class="label-title">时间段:</span><span>${startTime}~${endTime}</span>
        </p>
        <p class="tips-content">
          <span class="label-title">价格:</span><span>${formatPrice} 元</span>
        </p>
      </div></div>`;
};

const cancelChecked = () => {
  checkedItems.value.forEach((item) => {
    item.classList.remove('checked');
    item.classList.remove('right');
    item.style.width = '30px';
  });
  checkedItems.value = [];
  phaseList.value = phaseList.value.filter((item) => !(item.startTime === start.value && item.endTime === end.value));
  reset();
};

const doReset = (resetPhaseList = false) => {
  mainContentRef.value.childNodes.forEach((item) => {
    if (item.id === 'reset') {
      return;
    }
    item.classList.remove('checked');
    item.classList.remove('right');
    item.style.width = '30px';
    start.value = null;
    end.value = null;
    item.innerHTML = '';
    startItem.value = null;
    endItem.value = null;
    checkedItems.value = [];
    const mouseenterEvent = moveInMap.get(item);
    const mouseleaveEvent = moveOutMap.get(item);
    if (mouseenterEvent) {
      item.removeEventListener('mouseenter', mouseenterEvent);
    }
    if (mouseleaveEvent) {
      item.removeEventListener('mouseleave', mouseleaveEvent);
    }
    if (resetPhaseList) {
      phaseList.value = [];
    }
  });
};

const reset = () => {
  start.value = '';
  end.value = '';
  startItem.value = null;
  endItem.value = null;
};

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  }
});

const phaseList = defineModel('phaseList', {
  type: Array,
  default: () => []
});

watch(
  () => phaseList.value,
  () => {
    // 切换日期时需要将之前的样式重置, 注意这里不能直接使用phaseList.value, 因为在watch中直接修改phaseList.value会死循环
    doReset();
    if (phaseList.value.length > 0) {
      phaseList.value.forEach((item) => {
        const { startTime, endTime, price } = item;
        const startDate = dayjs('2018-04-25 ' + startTime, 'YYYY-MM-DD HH:mm');
        let endDate;
        if (endTime === '00:00') {
          endDate = dayjs('2018-04-26 ' + endTime, 'YYYY-MM-DD HH:mm');
        } else {
          endDate = dayjs('2018-04-25 ' + endTime, 'YYYY-MM-DD HH:mm');
        }
        const diff = endDate.diff(startDate, 'minute');
        const range = Math.abs(diff) / 30;
        let startElement;
        for (let i = 0; i < range; i++) {
          let time = startDate.add(i * 30, 'minute').format('HH:mm');
          if (time === '00:00') {
            time = '23:30';
          }
          const item = mainContentRef.value.querySelector(`[data="${time}"]`);
          if (i === 0) {
            startElement = item;
            item.style.width = 30 * range + 'px';
            tryAddBorder(item);
          } else {
            item.style.width = '0px';
          }
          item.classList.add('checked');
        }
        if (range >= 4) {
          addChildTips(startElement, startTime, endTime, price);
        } else {
          addTips(startElement, startTime, endTime, price);
        }
      });
    }
  }
);

onMounted(() => {
  if (props.disabled) {
    mainContentRef.value.addEventListener(
      'click',
      (e) => {
        e.stopPropagation();
      },
      true
    );
  }
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

.disable-click {
  pointer-events: none;
}

.item-content {
  display: flex;
  flex-wrap: wrap;
  margin-left: 20px;
  box-sizing: border-box;

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
    border-top: none;
    border-bottom: none;
    border-right: 1px solid #cecece;
  }

  .item.checked {
    background-color: #74b9ff;
    cursor: pointer;
    border-right: none;
  }

  .item.checked.right {
    box-sizing: border-box;
    border-right: 1px solid #cecece;
  }
}
</style>
