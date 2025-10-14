<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="备注信息" clearable @keyup.enter="getPage" maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getPage">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="channel" label="客户端类型" />
        <el-table-column prop="wechatPay" label="微信支付" >
          <template #default="scope">
            <el-switch v-model="scope.row.wechatPay" inline-prompt active-text="开启" inactive-text="关闭" disabled style="--el-switch-off-color: #ff4949" />
          </template>
        </el-table-column>
        <el-table-column prop="aliPay" label="支付宝支付" >
          <template #default="scope">
            <el-switch v-model="scope.row.aliPay" inline-prompt active-text="开启" inactive-text="关闭" disabled style="--el-switch-off-color: #ff4949" />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注信息" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button v-has-perm="'euR0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <PayForm ref="payFormRef" @reload="getPage" />
</template>
<script setup>
import { listPageApi } from '@/api/config/pay';
import { Edit } from '@element-plus/icons-vue';
import usePermStore from '@/store/perm';
import PayForm from '@/views/operation/pay/PayForm.vue'

const permStore = usePermStore();
const loading = ref(false);
const pageData = ref([]);
const selectAuth = permStore.hasAuth('fuR0');
const queryParams = reactive({ queryName: ''});
const payFormRef = ref();

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await listPageApi(queryParams);
      pageData.value = data;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getPage();
});

const handleEdit = (row) => {
  payFormRef.value.openDialog(row);
};

</script>
