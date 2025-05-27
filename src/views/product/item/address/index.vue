<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="负责人昵称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="nickName" label="负责人昵称" />
        <el-table-column prop="mobile" label="负责人手机号码" />
        <el-table-column prop="addressType" label="地址类型" :formatter="formatter"/>
        <el-table-column prop="detailAddress" label="详细地址" min-width="200" />
        <el-table-column prop="latitude" label="经纬度" min-width="120" :formatter="formatter"/>
        <el-table-column prop="remark" label="备注信息" min-width="150"/>
        <el-table-column prop="createTime" label="创建时间" width="170"/>
        <el-table-column prop="updateTime" label="更新时间" width="170"/>
        <el-table-column label="操作" fixed="right">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'SQO0'" title="新增店铺地址" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'yQO0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'MQO0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
          </template>
        </el-table-column>
      </el-table>
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
  <AddressForm ref="addressRef" @reload="getPage"></AddressForm>
</template>
<script setup>
import { deleteApi, listPageApi } from '@/api/product/address';
import { Delete, Edit } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import AddressForm from '@/views/product/item/address/AddressForm.vue';
import CreateButton from '@/components/CreateButton.vue';
import { renderMsg } from '@/utils/common.js'

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('4QO0');
const addressRef = ref();

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10
});

const formatter = (row, column, cellValue) => {
  if (column.property === 'addressType') {
    return cellValue === 1 ? '收货' : '自提';
  } else {
    return row.longitude + '~' + cellValue;
  }
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

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  getPage();
});

const handleDelete = (row) => {
  const msg = renderMsg(["确定要", () => "删除", "该收货地址吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('收货地址删除成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  addressRef.value.openDialog({});
};

const handleEdit = (row) => {
  addressRef.value.openDialog(row);
};
</script>
