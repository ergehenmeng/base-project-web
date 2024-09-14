<template>
  <el-dialog v-model="showDialog" width="650px" draggable align-center :close-on-click-modal="false">
    <template #header>
      <span>增加库存<QuestionTip content="最少选择一个规格"/></span>
    </template>
    <span style="font-weight: bold; margin-bottom: 10px; margin-left: 5px; ">商品名称: {{ formData.title }}</span>
    <el-table :data="skuData" style="width: 100%" stripe v-loading="loading" show-overflow-tooltip>
      <el-table-column prop="primarySpecValue" label="规格名称" min-width="100" :formatter="formatter"/>
      <el-table-column prop="salePrice" label="销售价格" width="100" />
      <el-table-column prop="saleNum" label="销售量" width="80" />
      <el-table-column prop="stock" label="剩余库存" width="100" />
      <el-table-column prop="addStock" label="新增库存" width="100" >
        <template #default="scope">
          <el-input v-model="scope.row.num" class="w60" maxlength="4"  onkeyup="this.value=this.value.replace(/\D/g,'')" ></el-input>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave" v-loading="loading">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { skuApi, addStockApi } from '@/api/product/item';
import { errorMsg, successMsg } from '@/utils/message'
import QuestionTip from '@/components/QuestionTip.vue'

const loading = ref(false);
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const skuData = ref([]);

const formData = ref({
  itemId: null,
  title: '',
  skuList: []
});

const openDialog = (row) => {
  showDialog.value = true;
  formData.value = { ...row };
  // 防止切换时显示上次的数据
  skuData.value = [];
  loading.value = true;
  skuApi({ id: row.itemId }).then((res) => {
    skuData.value = res.data;
  }).finally(() => {
    loading.value = false;
  })
};

const handleSave = () => {
  formData.value.skuList = [];
  skuData.value.forEach((item) => {
    if (item.num) {
      formData.value.skuList.push({
        id: item.id,
        num: item.num
      })
    }
  })
  if (formData.value.skuList.length === 0) {
    errorMsg('请输入库存数量');
    return;
  }

  loading.value = true;
  addStockApi(formData.value)
    .then(() => {
      successMsg('库存添加成功');
      showDialog.value = false;
      emit('reload');
    })
    .finally(() => {
      loading.value = false;
  });
};

const formatter = (row, _column, cellValue) => {
  if (!cellValue) {
    return '单规格';
  }
  return cellValue + (row.secondSpecValue !== null ?  ('/' + row.secondSpecValue) : '');
};

defineExpose({
  openDialog
});
</script>
