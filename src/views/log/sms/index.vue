<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="手机号" clearable @keyup.enter="search" style="width: 250px" maxlength="30" />
        </el-form-item>
        <el-form-item label="资金类型">
          <el-select v-model="queryParams.smsType" clearable style="width: 180px">
            <el-option label="自定义短信" value="default" />
            <el-option label="登陆发送短信" value="login" />
            <el-option label="忘记密码发送短信" value="forget" />
            <el-option label="注册发送短信" value="register" />
            <el-option label="商户解绑微信号短信" value="merchant_unbind" />
            <el-option label="更换邮箱发送短信验证码" value="change_email" />
            <el-option label="确认无房,发送通知短信" value="confirm_no_room" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送状态">
          <el-select v-model="queryParams.state" clearable style="width: 100px">
            <el-option label="成功" :value="1" />
            <el-option label="失败" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送日期">
          <div style="width: 220px">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="queryParams.activityDate" style="width: 220px"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="smsType" label="短信类型" :formatter="formatter" width="200" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="content" label="短信内容" min-width="300" />
        <el-table-column prop="state" label="发送状态" :formatter="formatter" />
        <el-table-column prop="createTime" label="发送时间" />
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
import { onMounted, reactive, ref } from 'vue';
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
  smsType: null,
  activityDate: []
});

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      if (queryParams.activityDate.length === 2) {
        queryParams.startDate = queryParams.activityDate[0];
        queryParams.endDate = queryParams.activityDate[1];
      }
      const { data } = await listPageApi(queryParams);
      pageData.value = data.rows;
      total.value = data.total;
    }
  } finally {
    loading.value = false;
  }
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'smsType') {
    switch (cellValue) {
      case 'default':
        return '自定义短信';
      case 'login':
        return '登陆发送短信';
      case 'forget':
        return '忘记密码发送短信';
      case 'register':
        return '注册发送短信';
      case 'merchant_unbind':
        return '商户解绑微信号短信';
      case 'change_email':
        return '更换邮箱发送短信验证码';
      case 'confirm_no_room':
        return '确认无房,发送通知短信';
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
