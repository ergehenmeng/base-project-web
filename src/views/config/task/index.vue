<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="任务名称、方法名、类名" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="已开启" :value="true" />
            <el-option label="未开启" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item class="right-button">
          <el-button type="primary" :icon="Refresh" @click="handleRefresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="title" label="任务名称" width="200" />
        <el-table-column prop="state" label="状态" width="80" >
          <template #default="scope">
            <el-switch v-model="scope.row.includeTitle" inline-prompt active-text="启用" inactive-text="禁用" disabled style="--el-switch-off-color: #ff4949" />
          </template>
        </el-table-column>
        <el-table-column prop="beanName" label="类名" width="200" />
        <el-table-column prop="methodName" label="方法名" width="150" />
        <el-table-column prop="args" label="方法入参" width="100" />
        <el-table-column prop="cronExpression" label="cron表达式" width="120" />
        <el-table-column prop="alarmEmail" label="报警邮箱" width="180" />
        <el-table-column prop="lockTime" label="锁时间(ms)" width="100" :formatter="formatter" />
        <el-table-column prop="updateTime" label="更新时间" width="170" />
        <el-table-column prop="remark" label="备注信息" min-width="100"/>
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="scope">
            <el-button v-has-perm="'tOR0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'KOR0'" @click="handleExecute(scope.row)" link title="执行定时任务">
              <Execute></Execute>
            </el-button>
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
  <SmsForm ref="formRef" @reload="getPage"></SmsForm>
</template>
<script setup>
import { executeApi, listPageApi, refreshApi } from '@/api/config/task';
import { Edit, Refresh } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import SmsForm from './TaskForm.vue';
import { confirmMsg, successMsg } from '@/utils/message.js';
import Execute from '@/components/icon/Execute.vue';

const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const formRef = ref();
const selectAuth = userStore.hasAuth('xOR0');

const queryParams = reactive({
  queryName: null,
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

const formatter = (_row, column, cellValue) => {
  if (column.property === 'lockTime') {
    return h('span', { title: '定时任务持有锁时间(单位:ms)' }, cellValue);
  } else {
    return cellValue;
  }
};

const handleRefresh = () => {
  confirmMsg('确定要刷新任务配置吗?', () => {
    refreshApi().then(() => {
      successMsg('任务刷新成功');
    });
  });
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

const handleExecute = (row) => {
  ElMessageBox.prompt('', '执行任务', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入方法入参',
    inputErrorMessage: '方法入参最大300字符',
    inputType: 'textarea',
    inputValue: row.args,
    inputValidator: (str) => {
      return str === null || str.length < 300;
    }
  })
    .then(({ value }) => {
      executeApi({ id: row.id, args: value }).then(() => {
        successMsg('任务执行成功');
        getPage();
      });
    })
    .catch(() => {});
};
</script>
