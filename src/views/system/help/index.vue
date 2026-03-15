<template>
  <router-view></router-view>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="问" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="问题分类">
          <el-select v-model="queryParams.helpType" clearable>
            <el-option v-for="item in dictList" :key="item.id" :label="item.showValue" :value="item.hiddenValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="显示" :value="1" />
            <el-option label="隐藏" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="ask" label="问" min-width="300" />
        <el-table-column prop="helpType" label="问题分类" :formatter="formatter" width="120"/>
        <el-table-column prop="state" label="状态" :formatter="formatter" width="100"/>
        <el-table-column prop="sort" label="排序" width="80">
          <template #default="scope">
            <el-input v-model="scope.row.sort" @change="handleSort(scope.row)" maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"/>
        <el-table-column prop="updateTime" label="更新时间" width="180"/>
        <el-table-column label="操作" width="180">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'33U0'" title="新增帮助问答" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'L3U0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'T3U0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
</template>
<script setup>
import { deleteApi, listPageApi, sortApi } from '@/api/system/help';
import { Delete, Edit } from '@element-plus/icons-vue'
import { confirmMsg, successMsg } from '@/utils/message';
import usePermStore from '@/store/perm';
import useDictStore from '@/store/dict.js';
import { useRouter } from 'vue-router';
import CreateButton from '@/components/CreateButton.vue';
import { renderMsg } from '@/utils/common.js'

const dictStore = useDictStore();
const dictList = dictStore.getDict('help_type');
const permStore = usePermStore();
const selectAuth = permStore.hasAuth('W3U0');
const sortAuth = permStore.hasAuth('o3U0');
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const router = useRouter();

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  helpType: null
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
  if (column.property === 'helpType') {
    return dictStore.parseDict('help_type', cellValue);
  } else if (column.property === 'state') {
    return cellValue === 1 ? '显示' : h('span', { style: 'color: #ff6b81;' }, '隐藏');
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

const handleEdit = (row) => {
  router.push('/sys/help/edit/' + row.id);
};

const handleSort = (row) => {
  if (!sortAuth) {
    return;
  }
  const data = { id: row.id, sortBy: row.sort };
  sortApi(data).then(() => {
    successMsg('排序更新成功');
    getPage();
  });
};

const handleDelete = (row) => {
  const msg = renderMsg(["确定要", () => "删除", "该问答吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('问答删除成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  router.push('/sys/help/create');
};
</script>
