<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="优惠券名称" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="发放状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="未开始" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="已结束" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="领取方式">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="页面领取" :value="1" />
            <el-option label="手动发放" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="有无库存">
          <el-select v-model="queryParams.inStock" clearable>
            <el-option label="有库存" :value="true" />
            <el-option label="无库存" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="优惠券名称" min-width="200" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="receiveNum" label="已领取数量" width="120" />
        <el-table-column prop="useNum" label="已使用数量" width="120" />
        <el-table-column prop="couponType" label="优惠券类型" width="100" :formatter="formatter" />
        <el-table-column prop="deductionValue" label="抵扣金额" width="80" />
        <el-table-column prop="discountValue" label="折扣比例" width="80" />
        <el-table-column prop="useThreshold" label="使用门槛" width="100" :formatter="formatter" />
        <el-table-column prop="useStartTime" label="使用时间段" min-width="280" :formatter="formatter" />
        <el-table-column prop="startTime" label="发放开始段" min-width="280" :formatter="formatter" />
        <el-table-column label="操作" fixed="right" min-width="200">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'PPi0'" title="新增优惠券" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'ePi0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'fPi0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'EPi0'" v-show="scope.row.state === 0" type="success" :icon="Top" @click="handleOpen(scope.row)" link title="启用"></el-button>
            <el-button v-has-perm="'wPi0'" v-show="scope.row.state === 1" type="warning" :icon="Bottom" @click="handleClose(scope.row)" link title="禁用"></el-button>
            <el-button v-has-perm="'1Pi0'" type="primary" :icon="Position" @click="handlePlatformUnShelves(scope.row)" link title="发放优惠券"></el-button>
            <el-button v-has-perm="'CPi0'" type="info" :icon="Notebook" @click="handlePlatformUnShelves(scope.row)" link title="领取详情"></el-button>
            <el-button v-has-perm="'zPi0'" :icon="Link" @click="handleDelete(scope.row)" link title="生成链接"></el-button>
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
</template>
<script setup>
import { deleteApi, listPageApi } from '@/api/marketing/coupon';
import { onMounted, reactive, ref } from 'vue';
import {Bottom, Document, Download, Edit, Link, Notebook, Position, Top} from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import CreateButton from '@/components/CreateButton.vue';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('sPi0');
const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  state: null,
  mode: null,
  inStock: null
});

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
  confirmMsg('确定要删除该优惠券吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('优惠券删除成功');
      getPage();
    });
  });
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'mode') {
    return cellValue === 1 ? '页面领取' : '手动发放';
  } else if (column.property === 'state') {
    return cellValue === 1 ? h('span', { style: 'color: green;' }, '启用') : '禁用';
  } else if (column.property === 'couponType') {
    return cellValue === 1 ? '抵扣券' : '折扣券';
  } else if (column.property === 'useThreshold') {
    return cellValue === '0' ? '不限制' : cellValue;
  } else if (column.property === 'useStartTime') {
    return cellValue + '~' + row.useEndTime;
  } else if (column.property === 'startTime') {
    return cellValue + '~' + row.endTime;
  } else {
    return cellValue;
  }
};

const handleOpen = (row) => {
  confirmMsg('确定要启用该优惠券吗?', () => {
    const data = { id: row.id };
    shelvesApi(data).then(() => {
      successMsg('优惠券启用成功');
      getPage();
    });
  });
};

const handleClose = (row) => {
  confirmMsg('确定要禁用该优惠券吗?', () => {
    const data = { id: row.id };
    unShelvesApi(data).then(() => {
      successMsg('优惠券禁用成功');
      getPage();
    });
  });
};

const handlePlatformUnShelves = (row) => {
  confirmMsg('确定要强制下架该优惠券吗?', () => {
    const data = { id: row.id };
    platformUnShelvesApi(data).then(() => {
      successMsg('优惠券强制下架成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  router.push('/marketing/coupon/create');
};

const handleEdit = (row) => {
  router.push('/marketing/coupon/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/marketing/coupon/detail/' + row.id);
};
</script>
