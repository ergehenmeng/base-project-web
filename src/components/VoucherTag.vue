<template>
  <el-select v-model="tagId" :disabled="props.disabled" :clearable="props.clearable" filterable>
    <el-option v-for="tag in tagList" :key="tag.id" :value="tag.id" :label="tag.title" :disabled="tag.state === false">
      <span style="float: left">{{ tag.title }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ tag.state ? '禁用' : '启用'}}</span>
    </el-option>
  </el-select>
</template>
<script setup>
import { listApi } from '@/api/product/voucher/tag';

const tagList = ref([]);

const props = defineProps({
  restaurantId: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  }
});

const tagId = defineModel();

const loadingTag = (id) => {
  if (id) {
    listApi({ id: id }).then((res) => {
      tagList.value = res.data;
    });
  }
}

watch(() => props.restaurantId, (newValue) => {
  loadingTag(newValue)
})

onMounted(() => {
  loadingTag(props.restaurantId)
});
</script>
