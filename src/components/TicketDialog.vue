<template>
  <el-dialog title="门票列表" v-model="showDialog" width="800px" draggable align-center :close-on-click-modal="false" :close-on-press-escape="false">
    <div>
      <el-transfer v-model="productIds" :data="pageData" :props="props" :titles="['未选择', '已选择']" target-order="push">
        <template #default="{ option }">
          <span style="float: left" :title="option.title">{{ option.title }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 10px;">{{ option.state === 0 ? '未上架' : option.state === 2 ? '强制下架' : '已上架' }}</span>
        </template>
        <template #left-footer>
          <el-button-group>
            <el-button size="small" @click="handleBefore" :disabled="queryParams.page === 1">上一页</el-button>
            <el-button size="small" @click="handleNext" :disabled="queryParams.page === Math.ceil(total.value / queryParams.pageSize)">下一页 </el-button>
          </el-button-group>
        </template>
      </el-transfer>
    </div>
    <template #footer>
      <span>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { ticketPageApi } from '@/api/product/ticket';

const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);
const productIds = ref([]);

const props = ref({
  key: 'id',
  label: 'title'
});

const total = ref(0);
const pageData = ref([]);

const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10
});

const openDialog = () => {
  showDialog.value = true;
};

const getPage = async () => {
  const { data } = await ticketPageApi(queryParams);
  pageData.value = data.rows;
  total.value = data.total;
};

const handleBefore = () => {
  if (queryParams.page === 1) {
    return;
  }
  queryParams.page--;
  getPage();
};

const handleNext = () => {
  if (queryParams.page === Math.ceil(total.value / queryParams.pageSize)) {
    return;
  }
  queryParams.page++;
  getPage();
};

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  getPage();
});

const handleCancel = () => {
  showDialog.value = false;
};

defineExpose({
  openDialog
});
</script>
<style lang="scss" scoped>
.el-transfer {
  --el-transfer-panel-width: 317px;
  --el-transfer-panel-body-height: 290px;
}
</style>