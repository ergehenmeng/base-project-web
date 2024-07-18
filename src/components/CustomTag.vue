<template>
  <div class="tag-box" @click="onclick" :style="{ width: props.width + 'px' }">
    <div class="tag-items">
      <el-tag v-for="(item) in tagList" :type="props.type" disable-transitions :key="item" closable @close="removeTag(item)">{{ item }}</el-tag>
    </div>
    <input :placeholder="props.placeholder" v-model="tagValue" @keyup.space="addTag" class="input-tag" ref="inputRef" type="text" />
  </div>
</template>

<script setup>
import { errorMsg } from '@/utils/message.js';

const tagList = defineModel({
  default: () => [],
  type: Array
});

const tagValue = ref(null);
const inputRef = ref();

const props = defineProps({
  type: {
    type: String,
    default: 'info'
  },
  width: {
    type: Number,
    default: 300
  },
  placeholder: {
    type: String,
    default: '按空格键生成标签'
  },
  limit: {
    type: Number,
    default: 3
  }
});

const onclick = () => {
  inputRef.value.focus();
};

const addTag = () => {
  if (tagList.value.length === props.limit) {
    errorMsg('标签数量已达上限');
    return;
  }
  if (tagList.value.indexOf(tagValue.value) > -1) {
    errorMsg('标签重复啦~');
  } else {
    console.log(tagValue.value);
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
  padding-left: 5px;
  word-wrap: break-word;
  overflow: hidden;
  display: flex;
}

.tag-items {
  display: flex;
  align-items: center;
  grid-gap: 5px;
  flex-wrap: wrap;
  padding: 4px 2px;
}

.input-tag {
  font-size: 12px;
  border: none;
  box-shadow: none;
  outline: none;
  background-color: transparent;
  padding: 0 0 0 5px;
  width: auto;
  min-width: 150px;
  vertical-align: top;
  height: 32px;
  color: #495060;
  line-height: 32px;
}
</style>