<template>
  <div :class="{'tag-box': true, 'is-disabled': disabled}" @click="onclick" :style="{ width: props.width + 'px' }">
    <el-tag v-for="(item, index) in tagList" :type="props.type" :key="index" disable-transitions :closable="!props.disabled" @close="removeTag(item)" class="tag-item">{{ item }}</el-tag>
    <input :placeholder="tagList.length > 0 || props.disabled ? '' : props.placeholder" v-model="tagValue" @keydown.space.prevent="addTag" :class="{'input-tag': true, 'is-disabled': disabled}" ref="inputRef" type="text"
           :maxlength="props.maxlength" :disabled="props.disabled"/>
  </div>
</template>

<script setup>
import { errorMsg } from '@/utils/message.js';

const tagList = defineModel({
  default: () => [],
  type: Array
})
const tagValue = ref(null);
const inputRef = ref();

const props = defineProps({
  type: {
    type: String,
    default: 'info'
  },
  width: {
    type: Number,
    default: 300,
    min: 100
  },
  placeholder: {
    type: String,
    default: '按空格键生成标签'
  },
  limit: {
    type: Number,
    default: 3
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    max: 6,
    default: 4
  }
});

const onclick = () => {
  inputRef.value.focus();
};

const addTag = () => {
  tagValue.value = tagValue.value.trim();
  if (!tagValue.value) {
    return;
  }
  if (tagValue.value.length > props.maxlength) {
    errorMsg('标签长度不能超过' + props.maxlength + '个字符');
    return;
  }
  if (tagList.value.length === props.limit) {
    errorMsg('标签数量已达上限');
    return;
  }
  if (tagList.value.indexOf(tagValue.value) > -1) {
    errorMsg('标签重复啦~');
  } else {
    tagList.value.push(tagValue.value);
    tagValue.value = null;
  }
};

const removeTag = (item) => {
  tagList.value.splice(tagList.value.indexOf(item), 1)
};
</script>

<style lang="scss" scoped>
.tag-box {
  box-sizing: border-box;
  background-color: white;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  font-size: 12px;
  text-align: left;
  word-wrap: break-word;
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  align-content: flex-start;
}

.tag-item {
  margin: 2px;
}

.input-tag {
  flex: 1;
  font-size: 12px;
  border: none;
  box-shadow: none;
  outline: none;
  background-color: transparent;
  padding-left: 5px;
  min-width: 70px;
  vertical-align: top;
  height: 30px;
  color: #495060;
  line-height: 30px;
}
.is-disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.input-tag::-webkit-input-placeholder {
  color: #a8abb2;
}
.input-tag:-moz-placeholder {
  color: #a8abb2;
}
.input-tag:-ms-input-placeholder {
  color: #a8abb2;
}
</style>