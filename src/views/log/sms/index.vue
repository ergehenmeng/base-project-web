<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="手机号" clearable @keyup.enter="search" class="w250" maxlength="30" />
        </el-form-item>
        <el-form-item label="资金类型">
          <el-select v-model="queryParams.templateType" clearable style="width: 180px">
            <el-option label="自定义短信" value="default" />
            <el-option label="登陆(后台)" value="user_login" />
            <el-option label="登陆" value="member_login" />
            <el-option label="注册" value="register" />
            <el-option label="忘记密码" value="forget" />
            <el-option label="更换邮箱" value="change_email" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送状态">
          <el-select v-model="queryParams.state" clearable style="width: 100px">
            <el-option label="成功" :value="1" />
            <el-option label="失败" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送日期">
          <div class="w220">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="queryParams.activityDate" class="w220"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="templateType" label="短信类型" :formatter="formatter" width="200" />
        <el-table-column prop="mobile" label="手机号" width="200"/>
        <el-table-column prop="content" label="短信内容" min-width="300" />
        <el-table-column prop="state" label="发送状态" :formatter="formatter" width="150"/>
        <el-table-column prop="createTime" label="发送时间" width="200"/>
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
import { listPageApi } from '@/api/log/sms';
import useUserStore from '@/store/user';

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('uLa0');
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  templateType: null,
  activityDate: []
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      if (queryParams.activityDate?.length === 2) {
        queryParams.startDate = queryParams.activityDate[0];
        queryParams.endDate = queryParams.activityDate[1];
      } else {
        queryParams.startDate = null;
        queryParams.endDate = null;
      }
      const { data } = await listPageApi(queryParams);
      pageData.value = data.rows;
      total.value = data.total;
    }
  } finally {
    loading.value = false;
  }
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'templateType') {
    switch (cellValue) {
      case 'default':
        return '自定义短信';
      case 'user_login':
        return '登陆(后台)';
      case 'member_login':
        return '登陆';
      case 'forget':
        return '忘记密码';
      case 'register':
        return '注册';
      case 'change_email':
        return '更换邮箱';
      default:
        return '未知';
    }
  } else if (column.property === 'state') {
    return cellValue === 0 ? h('span', { style: 'color: red' }, '失败') : '成功';
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
</script>
