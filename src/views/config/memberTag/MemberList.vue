<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="昵称、手机号" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable class="w100">
            <el-option label="正常" :value="true" />
            <el-option label="冻结" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="queryParams.sex" clearable class="w100">
            <el-option label="未知" :value="0" />
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="访问渠道">
          <el-select v-model="queryParams.channel" clearable class="w120">
            <el-option label="PC" value="PC" />
            <el-option label="ANDROID" value="ANDROID" />
            <el-option label="IOS" value="IOS" />
            <el-option label="H5" value="H5" />
            <el-option label="WECHAT" value="WECHAT" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册日期">
          <div class="w220">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="queryParams.activityDate" class="w220"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item class="right-bottom" v-has-perm="'anR0'">
          <el-button type="primary" @click="handleNotice">站内信</el-button>
        </el-form-item>
        <el-form-item class="right-bottom" v-has-perm="'0nR0'">
          <el-button type="primary" @click="handleSms">营销短信</el-button>
        </el-form-item>
        <el-form-item class="right-bottom" v-has-perm="'dnR0'">
          <el-button type="primary" @click="handleCoupon">优惠券</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image fit="cover" :src="scope.row.avatar" style="width: 50px; height: 50px" preview-teleported hide-on-click-modal />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" width="120" />
        <el-table-column prop="mobile" label="手机号码" width="120" />
        <el-table-column prop="email" label="电子邮箱" width="180" />
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="score" label="积分" width="100" />
        <el-table-column prop="inviteCode" label="邀请码" width="100" />
        <el-table-column prop="sex" label="性别" width="80" :formatter="formatter" />
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column prop="birthday" label="生日" width="100" />
        <el-table-column prop="channel" label="注册渠道" width="100" />
        <el-table-column prop="createTime" label="注册时间" width="180" />
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
  <SendSmsForm ref="smsRef"></SendSmsForm>
  <SendNoticeForm ref="noticeRef"></SendNoticeForm>
  <GrantCouponForm ref="couponRef"></GrantCouponForm>
</template>
<script setup>
import { memberListApi } from '@/api/config/memberTag';
import useUserStore from '@/store/user';
import { useRoute } from 'vue-router';
import SendSmsForm from "@/views/common/SendSmsForm.vue";
import SendNoticeForm from "@/views/common/SendNoticeForm.vue";
import GrantCouponForm from "./GrantCouponForm.vue";

const route = useRoute();
const loading = ref(false);
const total = ref(0);
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('9nR0');
const smsRef = ref();
const noticeRef = ref();
const couponRef = ref();
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  sex: null,
  channel: null,
  tagId: '',
  activityDate: []
});

const pageData = ref([]);

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      if (queryParams.activityDate.length === 2) {
        queryParams.startDate = queryParams.activityDate[0];
        queryParams.endDate = queryParams.activityDate[1];
      }
      const { data } = await memberListApi(queryParams);
      pageData.value = data.rows;
      total.value = data.total;
    }
  } finally {
    loading.value = false;
  }
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'state') {
    return cellValue ? h('span', { style: 'color: green;' }, '正常') : h('span', { style: 'color: #ff3d3d;' }, '冻结');
  } else if (column.property === 'sex') {
    if (cellValue === 0) {
      return '未知';
    }
    return cellValue === 1 ? '男' : '女';
  } else {
    return cellValue;
  }
};

const search = () => {
  queryParams.page = 1;
  getPage();
};

onMounted(() => {
  queryParams.tagId = route.params.id;
  getPage();
});

const handleSms = (row) => {
  smsRef.value.openDialog({ tagId: [row.id] });
};

const handleCoupon = (row) => {
  couponRef.value.openDialog({ tagId: [row.id] });
};

const handleNotice = (row) => {
  noticeRef.value.openDialog({ tagId: [row.id] });
};
</script>
