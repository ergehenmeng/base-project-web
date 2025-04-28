<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="标签名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable class="w120">
            <el-option label="禁用" :value="false" />
            <el-option label="正常" :value="true" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属店铺">
          <RestaurantSelect v-model="queryParams.restaurantId" style="width: 200px !important"></RestaurantSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="title" label="标签名称" width="180" />
        <el-table-column prop="restaurantName" label="所属店铺" width="200" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" >
          <template #header>
            <span>状态<QuestionTip content="注意: 禁用后整个标签下的所有商品均不在前端展示"/></span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" >
          <template #default="scope">
            <el-input v-model="scope.row.sort" @change="handleSort(scope.row)" maxlength="3" :readonly="!sortAuth" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注信息" min-width="150" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'dVO0'" title="新增标签" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'pVO0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'XVO0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
  <TagForm ref="tagFormRef" @reload="getPage" />
</template>
<script setup>
import { deleteApi, listPageApi, sortApi } from '@/api/product/voucher/tag';
import { Delete, Edit } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import RestaurantSelect from '@/components/RestaurantSelect.vue';
import CreateButton from '@/components/CreateButton.vue';
import QuestionTip from '@/components/QuestionTip.vue'
import TagForm from '@/views/product/voucher/tag/TagForm.vue'
import { renderMsg } from '@/utils/common.js'

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('0VO0');
const sortAuth = userStore.hasAuth('hVO0');
const tagFormRef = ref()

const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  state: null
});

const handleSort = (row) => {
  if (!sortAuth) {
    return;
  }
  const data = { id: row.id, sortBy: row.sort };
  sortApi(data).then(() => {
    successMsg('排序更新成功');
    getPage();
  });
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
  const msg = renderMsg(["确定要", () => "删除", "该标签吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('标签删除成功');
      getPage();
    });
  });
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'state') {
    return cellValue ? h('span', { style: 'color: green;' }, '正常') : h('span', { style: 'color: #ff6b81;' }, '禁用');
  } else {
    return cellValue;
  }
};

const handleCreate = () => {
  tagFormRef.value.openDialog({});
};

const handleEdit = (row) => {
  tagFormRef.value.openDialog(row);
};

</script>
