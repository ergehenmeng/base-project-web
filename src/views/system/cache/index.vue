<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="80px">
        <el-form-item v-has-perm="'w7K0'" style="margin-left: 30px;">
          <el-button type="primary" :icon="Refresh" @click="handeClear" :disabled="selected.length === 0 ">清除缓存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" ref="tableRef" @selection-change="handleSelected" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column type="selection" width="50"/>
        <el-table-column prop="cacheName" label="缓存名称" />
        <el-table-column prop="updateTime" label="最近一次更新时间" :formatter="formatter"/>
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </div>
  </div>
</template>
<script setup>
import {clearApi, listPageApi} from '@/api/system/cache';
import {onMounted, ref} from 'vue';
import {Refresh} from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import dayjs from "dayjs";

const userStore = useUserStore();

const selected = ref([]);
const loading = ref(false)
const tableRef = ref();
const pageData = ref([]);

const getPage = async () => {
  loading.value = true;
  try {
    if (userStore.hasAuth('E7K0')) {
      const { data } = await listPageApi();
      pageData.value = data;
    }
  } finally {
    loading.value = false;
  }
}

const handleSelected = (val) => {
  selected.value = val.map(item => item.cacheName);
}

const handeClear = () => {
  loading.value = true;
  clearApi({cacheNames: selected.value}).then(() => {
    ElMessage.success('缓存清除成功');
    getPage();
  }).finally(() => {
    loading.value = false;
  })
}

onMounted(() => {
  getPage()
})

const formatter = (row, column, cellValue) => {
  const updateTime = dayjs(cellValue);
  const nowTime = dayjs();
  return nowTime.diff(updateTime, 'minute') <= 60 ? h('span', { style: 'color: green; font-weight: bold;' }, cellValue) : cellValue
}

</script>

