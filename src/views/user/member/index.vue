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
        <el-form-item>
          <el-input v-model="queryParams.mobile" placeholder="邀请人手机号" clearable />
        </el-form-item>
        <el-form-item label="注册日期">
          <div class="w220">
            <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="activityDate" class="w220"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item v-has-perm="'nNp0'">
          <el-button type="primary" :icon="Download" @click="handleExcel" :loading="exportLoading" title="最多导出10000条数据">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" v-loading="loading" max-height="650" show-overflow-tooltip>
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                fit="cover"
                :src="scope.row.avatar?.split(',')[0]"
                :preview-src-list="scope.row.avatar?.split(',')"
                style="width: 30px; height: 30px"
                preview-teleported
                hide-on-click-modal
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" min-width="100" />
        <el-table-column prop="mobile" label="手机号码" width="120" />
        <el-table-column prop="email" label="电子邮箱" width="200" />
        <el-table-column prop="state" label="状态" width="80" >
          <template #default="scope">
            <el-switch v-model="scope.row.state" inline-prompt active-text="正常" inactive-text="冻结" disabled style="--el-switch-off-color: #ff4949" />
          </template>
        </el-table-column>
        <el-table-column prop="score" label="积分" width="100" >
          <template #default="scope" v-if="scoreAuth">
            <el-link type="primary" underline="never" @click="handleScoreLog(scope.row)">{{ scope.row.score }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="inviteCode" label="邀请码" width="100" />
        <el-table-column prop="sex" label="性别" width="80" :formatter="formatter" />
        <el-table-column prop="realName" label="真实姓名" width="100" />
        <el-table-column prop="birthday" label="生日" width="100" />
        <el-table-column prop="channel" label="注册渠道" width="100" />
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button v-has-perm="'YNp0'" @click="handleLoginLog(scope.row)" link title="登录日志">
              <LoginLog/>
            </el-button>
            <el-button v-has-perm="'ONp0'" v-show="scope.row.state" type="warning" :icon="Lock" @click="handleFreeze(scope.row)" link title="冻结"></el-button>
            <el-button v-has-perm="'cNp0'" v-show="!scope.row.state" type="success" :icon="Unlock" @click="handleUnFreeze(scope.row)" link title="解冻"></el-button>
            <el-button v-has-perm="'DNp0'" @click="handleLogout(scope.row)" link title="强制下线">
              <Offline/>
            </el-button>
            <el-button v-has-perm="'GNp0'" @click="handleScore(scope.row)" link title="更新积分">
              <Score/>
            </el-button>
            <el-button v-has-perm="'uNp0'" type="primary" :icon="Message" @click="handleSms(scope.row)" link title="发送短信通知"> </el-button>
            <el-button v-has-perm="'NNp0'" :icon="ChatDotSquare" @click="handleNotice(scope.row)" link title="发送站内信通知"> </el-button>
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
  <SendSmsForm ref="smsRef"></SendSmsForm>
  <SendMessageForm ref="noticeRef"></SendMessageForm>
  <ScoreForm ref="scoreRef" @reload="getPage"></ScoreForm>
  <ScoreLogForm ref="scoreLogRef"/>
</template>
<script setup>
import { exportApi, freezeApi, listPageApi, offlineApi, unfreezeApi } from '@/api/user/member';
import { ChatDotSquare, Download, Lock, Message, Unlock } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import usePermStore from '@/store/perm';
import Offline from '@/components/icon/Offline.vue';
import { useRouter } from 'vue-router';
import SendSmsForm from '@/views/common/SendSmsForm.vue';
import SendMessageForm from '@/views/common/SendMessageForm.vue';
import { downloadExcel, renderMsg } from '@/utils/common.js';
import Score from '@/components/icon/Score.vue';
import ScoreForm from '@/views/user/member/ScoreForm.vue';
import ScoreLogForm from '@/views/user/member/ScoreLogForm.vue';
import LoginLog from '@/components/icon/LoginLog.vue';

const router = useRouter();
const loading = ref(false);
const total = ref(0);
const permStore = usePermStore();
const selectAuth = permStore.hasAuth('XqK0');
const scoreAuth = permStore.hasAuth('ANp0');
const smsRef = ref();
const noticeRef = ref();
const scoreRef = ref();
const scoreLogRef = ref();
const activityDate = ref([])
const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  sex: null,
  channel: null,
  startDate: null,
  endDate: null,
  mobile: null
});

const pageData = ref([]);

const getPage = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      if (activityDate.value?.length === 2) {
        queryParams.startDate = activityDate.value[0];
        queryParams.endDate = activityDate.value[1];
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

const exportLoading = ref(false);

const handleExcel = () => {
  exportLoading.value = true;
  exportApi(queryParams)
    .then((res) => {
      downloadExcel(res, '会员列表');
    })
    .catch((error) => {
      successMsg('导出失败', error);
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'sex') {
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
  getPage();
});

const handleFreeze = (row) => {
  const msg = renderMsg(["确定要", () => "冻结", "该用户吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    freezeApi(data).then(() => {
      successMsg('用户冻结成功');
      getPage();
    });
  });
};

const handleUnFreeze = (row) => {
  const msg = renderMsg(["确定要", () => "解冻", "该用户吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    unfreezeApi(data).then(() => {
      successMsg('用户解冻成功');
      getPage();
    });
  });
};

const handleScore = (row) => {
  scoreRef.value.openDialog({ id: row.id });
};

const handleScoreLog = (row) => {
  scoreLogRef.value.openDialog({ id: row.id });
};

const handleLogout = (row) => {
  const msg = renderMsg(["确定要", () => "强制下线", "该用户吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    offlineApi(data).then(() => {
      successMsg('用户强制下线成功');
      getPage();
    });
  });
};

const handleLoginLog = (row) => {
  router.push('/user/member/login/' + row.id);
};

const handleSms = (row) => {
  smsRef.value.openDialog({ memberIds: [row.id] });
};

const handleNotice = (row) => {
  noticeRef.value.openDialog({ memberIds: [row.id] });
};
</script>
