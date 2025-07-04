<template>
  <el-dialog title="积分日志" v-model="showDialog" width="650px" draggable align-center :close-on-click-modal="false">
    <div class="page-content">
      <div>
        <el-form :inline="true" label-width="70px">
          <el-form-item label="积分类型" class="w250">
            <el-select v-model="queryParams.scoreType" clearable>
              <el-option label="签到积分" value="1" />
              <el-option label="抽奖积分" value="2" />
              <el-option label="支付积分" value="3" />
              <el-option label="支付取消" value="4" />
              <el-option label="退款" value="5" />
              <el-option label="系统扣除" value="6" />
              <el-option label="系统奖励" value="7" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table :data="pageData" style="width: 100%" v-loading="loading" height="360" show-overflow-tooltip>
          <el-table-column prop="score" label="积分数" width="100" :formatter="formatter"/>
          <el-table-column prop="type" label="积分类型" width="100" :formatter="formatter"/>
          <el-table-column prop="createTime" label="收支时间" width="180" />
          <el-table-column prop="remark" label="备注" min-width="100" />
        </el-table>
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[10, 20, 50]"
            layout="->, total, sizes, prev, pager, next"
            :total="total"
            @change="getPage"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { scoreLogPageApi } from '@/api/user/member/index.js'
import useUserStore from '@/store/user.js'

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);
const total = ref(0);
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('ANp0');
const pageData = ref([]);

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  memberId: null,
  type: null
});

const search = () => {
  queryParams.page = 1;
  getPage();
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'score') {
    if (row.type === 1 || row.type === 2 || row.type === 4 || row.type === 5 || row.type === 7) {
      return h('span', { style: 'color: green;' }, '+' + cellValue);
    } else {
      return h('span', { style: 'color: red;' }, '-' + cellValue);
    }
  } else if (column.property === 'type') {
    switch (cellValue) {
      case 1:
        return '签到积分';
      case 2:
        return '抽奖积分';
      case 3:
        return '支付积分';
      case 4:
        return '支付取消';
      case 5:
        return '退款';
      case 6:
        return '系统扣除';
      case 7:
        return '系统奖励';
      default:
        return '无';
    }
  } else {
    return cellValue;
  }
};

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await scoreLogPageApi(queryParams);
      pageData.value = data.rows;
      total.value = data.total;
    }
  } finally {
    loading.value = false;
  }
};

const openDialog = (row) => {
  showDialog.value = true;
  queryParams.memberId = row.id;
  search();
};

defineExpose({
  openDialog
});
</script>
<style lang="scss" scoped>
.page-content {
  padding: 10px;
}
</style>