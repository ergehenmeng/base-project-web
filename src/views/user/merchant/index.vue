<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="商家名称、手机号、法人信息" class="w250" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="商户类型">
          <el-select v-model="queryParams.type" clearable>
            <el-option label="景区" :value="1" />
            <el-option label="民宿" :value="2" />
            <el-option label="餐饮" :value="4" />
            <el-option label="零售" :value="8" />
            <el-option label="线路" :value="16" />
            <el-option label="场馆" :value="32" />
          </el-select>
        </el-form-item>
        <el-form-item label="商家状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="锁定" :value="0" />
            <el-option label="正常" :value="1" />
            <el-option label="销户" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业类型">
          <el-select v-model="queryParams.enterpriseType" clearable>
            <el-option label="个体工商户" :value="1" />
            <el-option label="企业" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'LYp0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading" title="最多导出10000条数据">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="650" show-overflow-tooltip>
        <el-table-column prop="merchantName" label="商家名称" width="200" />
        <el-table-column prop="type" label="商家类型" width="100" :formatter="formatter" />
        <el-table-column prop="state" label="商家状态" width="100" :formatter="formatter"/>
        <el-table-column prop="mobile" label="联系人电话" width="150" />
        <el-table-column prop="account" label="账户名" width="100" />
        <el-table-column prop="authMobile" label="微信授权手机号" width="150" />
        <el-table-column prop="enterpriseType" label="企业类型" width="100" :formatter="formatter" />
        <el-table-column prop="legalName" label="法人姓名" width="120" />
        <el-table-column prop="legalIdCard" label="法人身份证" width="180" />
        <el-table-column prop="platformServiceRate" label="平台服务费(%)" width="150" />
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        <el-table-column label="操作" min-width="250" fixed="right">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'mYp0'" title="新增商户" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'TYp0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'BYp0'" v-show="scope.row.state !== 2" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'7Yp0'" v-show="scope.row.state === 1" type="warning" :icon="Lock" @click="handleLock(scope.row)" link title="锁定"></el-button>
            <el-button v-has-perm="'3Yp0'" v-show="scope.row.state === 0" type="success" :icon="Unlock" @click="handleUnlock(scope.row)" link title="解锁"></el-button>
            <el-button v-has-perm="'WYp0'" v-show="scope.row.state !== 2" @click="handleReset(scope.row)" link title="重置密码">
              <ResetPwd></ResetPwd>
            </el-button>
            <el-button v-has-perm="'vYp0'" v-show="scope.row.state !== 2" @click="handleServiceRate(scope.row)" link title="调整费率"><Rate></Rate></el-button>
            <el-button v-has-perm="'oYp0'" v-show="scope.row.state !== 2" @click="handleUnbind(scope.row)" link title="解绑授权手机号"><Unbind></Unbind></el-button>
            <el-button v-has-perm="'Iup0'" v-show="scope.row.state !== 2" @click="handleCloseAccount(scope.row)" link title="注销商户"><Logout :size="12"></Logout></el-button>
          </template>
        </el-table-column>
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
  <ServiceRateForm ref="rateRef" @reload="getPage"></ServiceRateForm>
</template>
<script setup>
import { exportApi, listPageApi, lockApi, logoutApi, resetPwdApi, unbindApi, unlockApi } from '@/api/user/merchant';
import { Document, Download, Edit, Lock, Unlock } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import usePermStore from '@/store/perm';
import CreateButton from '@/components/CreateButton.vue';
import Rate from '@/components/icon/Rate.vue';
import Unbind from '@/components/icon/Unbind.vue';
import Logout from '@/components/icon/Logout.vue';
import { useRouter } from 'vue-router';
import { downloadExcel, parseMerchantType, renderMsg } from '@/utils/common.js'
import ServiceRateForm from '@/views/user/merchant/ServiceRateForm.vue';
import ResetPwd from '@/components/icon/ResetPwd.vue';

const rateRef = ref();
const router = useRouter();
const loading = ref(false);
const total = ref(0);
const permStore = usePermStore();
const selectAuth = permStore.hasAuth('2Yp0');
const pageData = ref([]);

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  type: null,
  enterpriseType: null
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

const formatter = (_row, column, cellValue) => {
  if (column.property === 'type') {
    return parseMerchantType(cellValue);
  } else if (column.property === 'enterpriseType') {
    return cellValue === 1 ? '个体工商户' : '企业';
  } else if (column.property === 'state') {
    if (cellValue === 0) {
      return h('span', { style: 'color: #e6a23c;' }, '锁定');
    }
    return cellValue === 1 ? h('span', { style: 'color: green;' }, '正常') :  h('span', { style: 'color: red;' }, '注销');
  } else {
    return cellValue;
  }
};

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  getPage();
});

const handleLock = (row) => {
  const msg = renderMsg(["确定要", () => "锁定", "该商户吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    lockApi(data).then(() => {
      successMsg('商户锁定成功');
      getPage();
    });
  });
};

const handleUnlock = (row) => {
  const msg = renderMsg(["确定要", () => "解锁", "该商户吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    unlockApi(data).then(() => {
      successMsg('商户解锁成功');
      getPage();
    });
  });
};

const handleReset = (row) => {
  const msg = renderMsg(["确定要", () => "重置", "该商户的密码吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    resetPwdApi(data).then(() => {
      successMsg('密码重置成功');
      getPage();
    });
  });
};

const handleCloseAccount = (row) => {
  const msg = renderMsg(["确定要", () => "注销", "该商户吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    logoutApi(data).then(() => {
      successMsg('商户注销成功');
    });
  });
};

const handleUnbind = (row) => {
  const msg = renderMsg(["确定要", () => "解绑", "该商户授权手机号吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    unbindApi(data).then(() => {
      successMsg('授权手机号解绑成功');
      getPage();
    });
  });
};

const exportLoading = ref(false);

const handleExcel = () => {
  exportLoading.value = true;
  exportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '商户列表');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const handleServiceRate = (row) => {
  rateRef.value.openDialog({ id: row.id, platformServiceRate: row.platformServiceRate });
};

const handleCreate = () => {
  router.push('/user/merchant/create');
};

const handleEdit = (row) => {
  router.push('/user/merchant/edit/' + row.id);
};

const handleDetail = (row) => {
  router.push('/user/merchant/detail/' + row.id);
};
</script>
