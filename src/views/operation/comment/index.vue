<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="资讯标题、活动名称" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryParams.objectType" clearable>
            <el-option label="资讯评论" :value="1" />
            <el-option label="活动评论" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="正常" :value="true" />
            <el-option label="已屏蔽" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="置顶状态">
          <el-select v-model="queryParams.topState" clearable>
            <el-option label="置顶" :value="1" />
            <el-option label="未置顶" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="objectName" label="文章名称" min-width="200" />
        <el-table-column prop="nickName" label="留言昵称" width="120" />
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image fit="cover" :src="scope.row.avatar" style="width: 50px; height: 50px" preview-teleported hide-on-click-modal />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评论信息" min-width="300" />
        <el-table-column prop="state" label="状态" :formatter="formatter" width="80" />
        <el-table-column prop="topState" label="置顶状态" width="80" :formatter="formatter" />
        <el-table-column prop="likeNum" label="点赞数量" width="100" />
        <el-table-column prop="reportNum" label="举报次数" width="100" :formatter="formatter" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" align="center" width="120">
          <template #default="scope">
            <el-button v-show="false" :icon="Hide" link title="占位"></el-button>
            <el-button v-has-perm="'dBU0'" v-show="scope.row.state === true" type="info" :icon="Hide" @click="handleShield(scope.row)" link title="屏蔽评论"></el-button>
            <el-button v-has-perm="'iBU0'" v-show="scope.row.state === false" type="warning" :icon="View" @click="handleUnShield(scope.row)" link title="显示评论"></el-button>
            <el-button v-has-perm="'hBU0'" v-show="scope.row.topState === 0" type="success" :icon="Top" @click="handleTop(scope.row)" link title="置顶评论"></el-button>
            <el-button v-has-perm="'XBU0'" v-show="scope.row.topState === 1" type="danger" :icon="Bottom" @click="handleUnTop(scope.row)" link title="取消置顶"></el-button>
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
import { listPageApi, shieldApi, topApi, unTopApi, unShieldApi } from '@/api/operation/comment';
import { Bottom, Hide, Top, View } from '@element-plus/icons-vue'
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('0BU0');
const reportAuth = userStore.hasAuth('pBU0');

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  topState: null,
  objectType: null
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

const handleShield = (row) => {
  confirmMsg('确定要屏蔽该评论信息吗?', () => {
    const data = { id: row.id };
    shieldApi(data).then(() => {
      successMsg('评论屏蔽成功');
      getPage();
    });
  });
};

const handleUnShield = (row) => {
  confirmMsg('确定要解除屏蔽该信息吗?', () => {
    const data = { id: row.id };
    unShieldApi(data).then(() => {
      successMsg('屏蔽接触成功');
      getPage();
    });
  });
};

const handleTop = (row) => {
  confirmMsg('确定要置顶该评论吗?', () => {
    const data = { id: row.id };
    topApi(data).then(() => {
      successMsg('评论置顶成功');
      getPage();
    });
  });
};

const handleUnTop = (row) => {
  confirmMsg('确定要取消该评论置顶吗?', () => {
    const data = { id: row.id };
    unTopApi(data).then(() => {
      successMsg('评论置顶取消成功');
      getPage();
    });
  });
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'state') {
    return cellValue ? '正常' : '已屏蔽';
  } else if (column.property === 'topState') {
    return cellValue === 0 ? '未置顶' : h('span', { style: 'color: red;' }, '置顶');
  } else if (column.property === 'reportNum') {
    // 点击小于0或没有权限不支持点击跳转
    if (cellValue <= 0 || !reportAuth) {
      return cellValue;
    }
    return h(
      'a',
      {
        style: 'color: red; cursor: pointer;',
        onClick(e) {
          router.push({
            name: 'commentReport',
            query: { commentId: row.id }
          });
        }
      },
      cellValue
    );
  } else {
    return cellValue;
  }
};
</script>
