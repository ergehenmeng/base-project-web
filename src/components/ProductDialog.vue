<template>
  <el-dialog :title="title" v-model="showDialog" width="800px" draggable align-center :close-on-click-modal="false" :close-on-press-escape="false" >
    <div class="product-list">
      <el-transfer v-model="productIds" @change="checkHandle" filterable :data="pageData" :props="props" :titles="['未选择', '已选择']" target-order="push" v-loading="loading" >
        <template #default="{ option }">
          <span style="float: left" :title="option.title">{{ option.title }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 20px">{{ option.state === 0 ? '未上架' : option.state === 2 ? '强制下架' : '已上架' }}</span>
        </template>
      </el-transfer>
    </div>
    <template #footer>
      <span>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ticketPageApi } from '@/api/product/ticket';
import { itemPageApi } from '@/api/product/item';
import { voucherPageApi } from '@/api/product/voucher';
import { linePageApi } from '@/api/product/line';
import { sitePageApi } from '@/api/product/site';
import { homestayPageApi } from '@/api/product/room';

import { parseProductType } from '@/utils/common.js';
import { warningMsg } from '@/utils/message.js';

const showDialog = ref(false);
const emit = defineEmits(['reload']);
const productIds = ref([]);
const title = ref('');
const loading = ref(false);
// 只读时,不需要编辑,且不需要保存
const readonly = ref(false);

const props = ref({
  key: 'id',
  label: 'title',
  disabled: 'disabled'
});

const pageData = ref([]);

const queryParams = reactive({
  queryName: null,
  limit: false
});

const checkHandle = () => {
  if (readonly.value) {
    warningMsg("注意：当前模式为只读,所有操作均无效")
  }
}

/**
 * 打开弹窗
 * @param productType 产品类型
 * @param ids 已选中的产品id集合
 * @param read 是否只读
 */
const openDialog = (productType, ids, read = false) => {
  try {
    loading.value = true
    getPageApi(productType);
  } finally {
    loading.value = false;
  }
  title.value = parseProductType(productType) + '列表';
  productIds.value = ids;
  showDialog.value = true;
  readonly.value = read;
};

const getPageApi = async (productType) => {
  let pageApi = null;
  switch (productType) {
    case 'ticket':
      pageApi = ticketPageApi;
      break;
    case 'item':
      pageApi = itemPageApi;
      break;
    case 'voucher':
      pageApi = voucherPageApi;
      break;
    case 'line':
      pageApi = linePageApi;
      break;
    case 'venue':
      pageApi = sitePageApi;
      break;
    case 'homestay':
      pageApi = homestayPageApi;
      break;
  }
  if (pageApi) {
    const { data } = await pageApi(queryParams);
    pageData.value = data.rows;
  }
};

const handleSave = () => {
  if (!readonly.value) {
    emit('reload', productIds.value);
  }
  showDialog.value = false;
};

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
  --el-transfer-panel-body-height: 300px;
}

.el-transfer .el-transfer-panel {
  height: 300px !important;
}
</style>
