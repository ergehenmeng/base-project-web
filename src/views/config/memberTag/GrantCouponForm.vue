<template>
  <el-dialog title="优惠券" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip highlight-current-row @current-change="handleCurrentChange">
      <el-table-column prop="title" label="优惠券名称" min-width="200" />
      <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
      <el-table-column prop="stock" label="库存" width="80" />
      <el-table-column prop="receiveNum" label="已领取数量" width="120" />
      <el-table-column prop="couponType" label="优惠券类型" width="100" :formatter="formatter" />
      <el-table-column prop="deductionValue" label="抵扣金额" width="80" />
      <el-table-column prop="discountValue" label="折扣比例" width="80" />
      <el-table-column prop="useThreshold" label="使用门槛" width="100" :formatter="formatter" />
    </el-table>
    <el-pagination
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.pageSize"
      :page-sizes="[10, 20, 50]"
      layout="->, total, sizes, prev, pager, next"
      :total="total"
      @change="getPage"
    />
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave" v-has-perm="'dnR0'">发放优惠券</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { errorMsg, successMsg } from '@/utils/message.js';
import { grantApi, listPageApi } from '@/api/marketing/coupon/index.js';
import useUserStore from '@/store/user.js';

const loading = ref(false);
const emit = defineEmits(['reload']);
const total = ref(0);
const pageData = ref([]);
const showDialog = ref(false);
const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  mode: 1
});
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('dnR0');

const formData = ref({
  tagId: null,
  couponId: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value.tagId = row.tagId;
};

const handleSave = () => {
  if (formData.value.couponId === null) {
    errorMsg('请选择优惠券');
    return;
  }
  loading.value = true;
  grantApi(formData.value)
    .then(() => {
      successMsg('优惠券发送成功');
      showDialog.value = false;
      emit('reload');
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleCurrentChange = (val) => {
  formData.value.couponId = val;
};

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await listPageApi(queryParams);
      pageData.value = data.rows;
      total.value = data.total;
    }
  } finally {
    loading.value = false;
  }
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'state') {
    return cellValue === 1 ? h('span', { style: 'color: green;' }, '启用') : '禁用';
  } else if (column.property === 'couponType') {
    return cellValue === 1 ? '抵扣券' : '折扣券';
  } else if (column.property === 'useThreshold') {
    return cellValue === '0' ? '不限制' : cellValue;
  } else {
    return cellValue;
  }
};

defineExpose({
  openDialog
});
</script>
