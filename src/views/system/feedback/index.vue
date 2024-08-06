<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="反馈人手机号、昵称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="问题分类">
          <el-select v-model="queryParams.feedbackType" clearable>
            <el-option v-for="item in dictList" :key="item.id" :label="item.showValue" :value="item.hiddenValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="已解决" :value="true" />
            <el-option label="待解决" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="content" label="反馈内容" min-width="150" />
        <el-table-column prop="imageUrl" label="图片" width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                fit="cover"
                :src="getPreview(scope.row)[0]"
                :preview-src-list="getPreview(scope.row)"
                style="width: 30px; height: 30px"
                preview-teleported
                hide-on-click-modal
                v-if="getPreview(scope.row).length > 0"
              >
              </el-image>
              <span v-else>无</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter" />
        <el-table-column prop="feedbackType" label="问题类型" :formatter="formatter" />
        <el-table-column prop="nickName" label="反馈人昵称" width="120" />
        <el-table-column prop="mobile" label="反馈人手机号" width="120" />
        <el-table-column prop="remark" label="回复内容" min-width="120"/>
        <el-table-column prop="createTime" label="反馈时间" width="170" />
        <el-table-column prop="updateTime" label="处理时间" width="170" />
        <el-table-column prop="version" label="软件版本" />
        <el-table-column prop="systemVersion" label="系统版本" />
        <el-table-column prop="deviceBrand" label="设备厂商" />
        <el-table-column prop="deviceModel" label="设备型号" />
        <el-table-column label="操作" fixed="right" width="60">
          <template #default="scope">
            <el-button v-has-perm="'7b50'" type="primary" :icon="ChatLineSquare" @click="handleDispose(scope.row)" link title="回复"></el-button>
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
  <FeedbackForm ref="formRef" @reload="getPage"></FeedbackForm>
</template>
<script setup>
import { listPageApi } from '@/api/system/feedback';
import { ChatLineSquare } from '@element-plus/icons-vue';
import FeedbackForm from './FeedbackForm.vue';
import useUserStore from '@/store/user';
import useDictStore from '@/store/dict.js';

const dictStore = useDictStore();
const dictList = dictStore.getDict('feedback_type');

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('Bb50');
const loading = ref(false);
const total = ref(0);
const formRef = ref();
const pageData = ref([]);

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: false,
  feedbackType: null
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

const handleDispose = (row) => {
  formRef.value.openDialog({ id: row.id });
};

const getPreview = (row) => {
  if (row.imageUrl) {
    return row.imageUrl.split(',');
  }
  return [];
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'state') {
    return cellValue ? '已解决' : '待解决';
  } else if (column.property === 'feedbackType') {
    return dictStore.parseDict('feedback_type', cellValue);
  } else {
    return cellValue;
  }
};
</script>
