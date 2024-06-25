<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="标签名称" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="标签名称" width="150" />
        <el-table-column prop="memberNum" label="会员数量" width="100" :formatter="formatter" />
        <el-table-column prop="registerStartDate" label="注册日期" width="120" />
        <el-table-column prop="registerEndDate" label="截止日期" width="120" />
        <el-table-column prop="consumeDay" label="最近几天有消费" width="130" />
        <el-table-column prop="consumeNum" label="最低消费次数" width="120" />
        <el-table-column prop="consumeAmount" label="最低消费金额" width="130" />
        <el-table-column prop="channel" label="注册渠道" width="100" />
        <el-table-column prop="sex" label="性别" width="80" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" min-width="150" fixed="right">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'NnR0'" title="新增标签" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'9nR0'" @click="handleMemberPage(scope.row)" link title="会员列表"></el-button>
            <el-button v-has-perm="'GnR0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'rnR0'" type="success" :icon="Connection" @click="handleRefresh(scope.row)" link title="刷新"></el-button>
            <el-button v-has-perm="'0nR0'" type="primary" :icon="Message" @click="handleSms(scope.row)" link title="发送短信通知"> </el-button>
            <el-button v-has-perm="'anR0'" :icon="ChatDotSquare" @click="handleNotice(scope.row)" link title="发送站内信通知"> </el-button>
            <el-button v-has-perm="'RnR0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
  <MemberTagForm ref="formRef" @reload="getPage"></MemberTagForm>
  <SendSmsForm ref="smsRef"></SendSmsForm>
  <SendNoticeForm ref="noticeRef"></SendNoticeForm>
</template>
<script setup>
import { deleteApi, listPageApi } from '@/api/config/memberTag';
import { onMounted, reactive, ref } from 'vue';
import { ChatDotSquare, Connection, Delete, Edit, Message } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import CreateButton from '@/components/CreateButton.vue';
import MemberTagForm from './MemberTagForm.vue';
import SendNoticeForm from '@/views/common/SendNoticeForm.vue';
import SendSmsForm from '@/views/common/SendSmsForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('JjK0');
const loading = ref(false);
const total = ref(0);
const formRef = ref();
const pageData = ref([]);
const smsRef = ref();
const noticeRef = ref();

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10
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

const handleEdit = (row) => {
  formRef.value.openDialog(row);
};

const formatter = (row, column, cellValue) => {
  return h('span', { title: '该值只是预估值, 请刷新标签获取最新值' }, cellValue);
};

const handleRefresh = (row) => {
  confirmMsg('确定要刷新该标签关联的会员吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('标签刷新成功');
      getPage();
    });
  });
};

const handleMemberPage = (row) => {
  router.push('/member/member?tagId=' + row.id);
};

const handleDelete = (row) => {
  confirmMsg('确定要删除该标签吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('标签删除成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  formRef.value.openDialog({});
};

const handleSms = (row) => {
  smsRef.value.openDialog({ tagId: row.id });
};

const handleNotice = (row) => {
  noticeRef.value.openDialog({ tagId: row.id });
};
</script>
