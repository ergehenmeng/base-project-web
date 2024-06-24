<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="商家名称、联系人手机号、授权手机号、法人姓名、法人身份证" style="width: 400px" clearable @keyup.enter="search" maxlength="50"/>
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
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="merchantName" label="商家名称" width="200" />
        <el-table-column prop="type" label="商家类型" width="250" :formatter="formatter" />
        <el-table-column prop="state" label="商家状态" width="100" :formatter="formatter" />
        <el-table-column prop="mobile" label="联系人电话" width="150" />
        <el-table-column prop="authMobile" label="授权手机号" width="130" />
        <el-table-column prop="enterpriseType" label="企业类型" width="100" :formatter="formatter" />
        <el-table-column prop="legalName" label="法人姓名" width="120" />
        <el-table-column prop="legalIdCard" label="法人身份证" width="180" />
        <el-table-column prop="creditCode" label="社会统一信用代码" width="180" />
        <el-table-column prop="platformServiceRate" label="平台服务费(%)" width="150"/>
        <el-table-column prop="createTime" label="创建时间" width="180"/>
        <el-table-column prop="updateTime" label="更新时间" width="180"/>
        <el-table-column label="操作" width="250" fixed="right">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'mYp0'" title="新增商户" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'TYp0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情"></el-button>
            <el-button v-has-perm="'BYp0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'7Yp0'" v-show="scope.row.state === 1" type="warning" :icon="Lock" @click="handleLock(scope.row)" link title="锁定"></el-button>
            <el-button v-has-perm="'3Yp0'" v-show="scope.row.state === 0" type="success" :icon="Unlock" @click="handleUnlock(scope.row)" link title="解锁"></el-button>
            <el-button v-has-perm="'WYp0'" type="primary" :icon="Refresh" @click="handleReset(scope.row)" link title="重置密码"></el-button>
            <el-button v-has-perm="'vYp0'" @click="handleServiceRate(scope.row)" link title="调整费率"><Rate></Rate></el-button>
            <el-button v-has-perm="'oYp0'" @click="handleServiceRate(scope.row)" link title="解绑手机号"><Unbind></Unbind></el-button>
            <el-button v-has-perm="'Iup0'" @click="handleServiceRate(scope.row)" link title="注销商户"><Logout></Logout></el-button>
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
import { listPageApi, lockApi, resetPwdApi, unlockApi } from '@/api/user/merchant';
import { h, onMounted, reactive, ref } from 'vue';
import { Document, Edit, Lock, Refresh, Unlock } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import CreateButton from '@/components/CreateButton.vue';
import Rate from '@/components/icon/Rate.vue'
import Unbind from '@/components/icon/Unbind.vue'
import Logout from '@/components/icon/Logout.vue'
import { useRouter } from 'vue-router'

const router = useRouter();
const loading = ref(false);
const total = ref(0);
const formRef = ref();
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('2Yp0');
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  type: null,
  enterpriseType: null,
});

const pageData = ref([]);

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
    if (cellValue === 1) {
      return h('span', { style: 'color: green;' }, '正常');
    }
    return cellValue === 0 ? h('span', { style: 'color: blue;' }, '锁定') : h('span', { style: 'color: red;' }, '销户');
  } else if (column.property === 'type') {
    const typeList = [];
    if ((cellValue & 1) === 1) {
      typeList.push("景区");
    }
    if ((cellValue & 2) === 2) {
      typeList.push("民宿");
    }
    if ((cellValue & 4) === 4) {
      typeList.push("餐饮");
    }
    if ((cellValue & 8) === 8) {
      typeList.push("零售");
    }
    if ((cellValue & 16) === 16) {
      typeList.push("线路");
    }
    if ((cellValue & 32) === 32) {
      typeList.push("场馆");
    }
    return typeList.join(',');
  } else if (column.property === 'enterpriseType') {
    return cellValue === 1 ? '个体工商户' : '企业';
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
  confirmMsg('确定要锁定该商户吗?', () => {
    const data = { id: row.id };
    lockApi(data).then(() => {
      successMsg('商户锁定成功');
      getPage();
    });
  });
};

const handleUnlock = (row) => {
  confirmMsg('确定要解锁该商户吗?', () => {
    const data = { id: row.id };
    unlockApi(data).then(() => {
      successMsg('商户解锁成功');
      getPage();
    });
  });
};

const handleReset = (row) => {
  confirmMsg('确定要重置该商户的密码?', () => {
    const data = { id: row.id };
    resetPwdApi(data).then(() => {
      successMsg('密码重置成功');
      getPage();
    });
  });
};

const handleServiceRate = (row) => {
  console.log("修改费率")
};

const handleCreate = () => {
  router.push("/user/merchant/create")
};

const handleEdit = (row) => {
  router.push("/user/merchant/edit/" + row.id);
}

const handleDetail = (row) => {
  router.push("/user/merchant/detail/" + row.id);
};

</script>
