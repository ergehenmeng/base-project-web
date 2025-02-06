<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="类型名称" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="区域">
          <PoiAreaSelect v-model="queryParams.areaCode"></PoiAreaSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="660" show-overflow-tooltip>
        <el-table-column prop="icon" label="图标">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image
                fit="cover"
                :src="scope.row.icon?.split(',')[0]"
                :preview-src-list="scope.row.icon?.split(',')"
                style="width: 30px; height: 30px"
                preview-teleported
                hide-on-click-modal
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="类型名称" />
        <el-table-column prop="areaTitle" label="所属区域" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" fixed="right" width="250">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'AiG0'" title="新增点位类型" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'riG0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'RiG0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
    <TypeForm ref="formRef" @reload="getPage"></TypeForm>
  </div>
</template>
<script setup>
import { deleteApi, listPageApi } from '@/api/poi/type';
import { Delete, Edit } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import useUserStore from '@/store/user';
import CreateButton from '@/components/CreateButton.vue';
import TypeForm from './TypeForm.vue';
import PoiAreaSelect from '@/components/PoiAreaSelect.vue';

const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth('GiG0');
const formRef = ref();
const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  areaCode: null
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

const handleDelete = (row) => {
  confirmMsg('确定要删除该点位类型吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('点位类型删除成功');
      getPage();
    });
  });
};

const handleCreate = () => {
  formRef.value.openDialog({});
};

const handleEdit = (row) => {
  formRef.value.openDialog(row);
};
</script>
