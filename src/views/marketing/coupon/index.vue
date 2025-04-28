<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="优惠券名称" clearable @keyup.enter="search" maxlength="30"/>
        </el-form-item>
        <el-form-item label="发放状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="未开始" :value="0" />
            <el-option label="进行中" :value="1" />
            <el-option label="已结束" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="领取方式">
          <el-select v-model="queryParams.mode" clearable >
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
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="title" label="优惠券名称" min-width="140" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" >
          <template #default="scope">
            <el-switch v-model="scope.row.state" :active-value="1" :inactive-value="0" inline-prompt active-text="启用" inactive-text="禁用" disabled style="--el-switch-off-color: #ff4949" />
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="60" />
        <el-table-column prop="receiveNum" label="已领取数量" width="100" />
        <el-table-column prop="useNum" label="已使用数量" width="100" />
        <el-table-column prop="mode" label="领取方式" width="90" :formatter="formatter"/>
        <el-table-column prop="couponType" label="优惠券类型" width="100" :formatter="formatter" />
        <el-table-column prop="discountValue" label="折扣比例" width="80" :formatter="(row, column, cellValue) => cellValue === null ? '': cellValue + '%' "/>
        <el-table-column prop="deductionValue" label="抵扣金额" width="80" />
        <el-table-column prop="useThreshold" label="使用门槛" width="80" :formatter="formatter" />
        <el-table-column prop="useStartTime" label="使用时间段" min-width="260" :formatter="formatter" />
        <el-table-column prop="startTime" label="发放开始段" min-width="260" :formatter="formatter" />
        <el-table-column label="操作" fixed="right" width="210">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'PPi0'" title="新增优惠券" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'ePi0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'fPi0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'EPi0'" v-show="scope.row.state === 0" type="success" :icon="Top" @click="handleOpen(scope.row)" link title="启用"></el-button>
            <el-button v-has-perm="'wPi0'" v-show="scope.row.state === 1" type="warning" :icon="Bottom" @click="handleClose(scope.row)" link title="禁用"></el-button>
            <el-button v-has-perm="'1Pi0'" v-show="scope.row.mode === 2" @click="handleGrant(scope.row)" link title="发放优惠券"><Grant/></el-button>
            <el-button v-has-perm="'CPi0'" type="info"  @click="handleReceiveDetail(scope.row)" link title="领取详情"><Receive/></el-button>
            <el-button v-has-perm="'zPi0'" type="warning" v-show="scope.row.mode === 1" :icon="Link" @click="handleLink(scope.row)" link title="生成链接"></el-button>
            <el-button v-has-perm="'QPi0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
import { closeApi, deleteApi, listPageApi, openApi } from '@/api/marketing/coupon'
import { Bottom, Delete, Document, Edit, Top, Link } from '@element-plus/icons-vue'
import { confirmMsg, messageBox, successMsg, warningMsg } from '@/utils/message'
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import CreateButton from '@/components/CreateButton.vue';
import { shortUrlApi } from '@/api/common/index.js'
import { useClipboard } from '@vueuse/core'
import Receive from '@/components/icon/Receive.vue'
import Grant from '@/components/icon/Grant.vue'
import { renderMsg } from '@/utils/common.js'

const { copy, isSupported } = useClipboard();
const shortUrl = import.meta.env.VITE_ITEM_SHORT_URL;
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

const formatter = (row, column, cellValue) => {
  if (column.property === 'mode') {
    return cellValue === 1 ? '页面领取' : '手动发放';
  } else if (column.property === 'state') {
    return cellValue === 1 ? h('span', { style: 'color: green;' }, '已启用') : '未启用';
  } else if (column.property === 'couponType') {
    return cellValue === 1 ? '抵扣券' : '折扣券';
  } else if (column.property === 'useThreshold') {
    return parseFloat(cellValue) === 0 ? '无门槛' : cellValue;
  } else if (column.property === 'useStartTime') {
    return cellValue + '~' + row.useEndTime;
  } else if (column.property === 'startTime') {
    return cellValue + '~' + row.endTime;
  } else {
    return cellValue;
  }
};

const handleOpen = (row) => {
  const msg = renderMsg(["确定要", () => "启用", "该优惠券吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    openApi(data).then(() => {
      successMsg('优惠券启用成功');
      getPage();
    });
  });
};

const handleClose = (row) => {
  const msg = renderMsg(["确定要", () => "禁用", "该优惠券吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    closeApi(data).then(() => {
      successMsg('优惠券禁用成功');
      getPage();
    });
  });
};

const handleDelete = (row) => {
  const msg = renderMsg(["确定要", () => "删除", "该优惠券吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('优惠券删除成功');
      getPage();
    });
  });
};

const handleLink = (row) => {
  if (row.state === 0) {
    warningMsg('优惠券未启用，请先启用优惠券')
    return;
  }
  loading.value = true
  shortUrlApi({ pageUrl: shortUrl + row.id, pageTitle: '优惠券领取', persistent: true}).then(({data}) => {
    if (isSupported) {
      copy(data);
      successMsg('链接复制成功');
    } else {
      messageBox(data);
    }
  }).finally(() => {
    loading.value = false
  })
};

const handleGrant = (row) => {
  router.push('/marketing/coupon/grant/' + row.id);
};

const handleReceiveDetail = (row) => {
  router.push('/marketing/coupon/receive/' + row.id);
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
