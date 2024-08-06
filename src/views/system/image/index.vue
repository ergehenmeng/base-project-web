<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="图片名称、备注" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="图片分类">
          <el-select v-model="queryParams.imageType" clearable>
            <el-option v-for="item in dictList" :key="item.id" :label="item.showValue" :value="item.hiddenValue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="图片名称" width="150" />
        <el-table-column prop="path" label="预览" width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image fit="cover" :src="scope.row.path" :preview-src-list="[scope.row.path]" style="width: 30px; height: 30px" preview-teleported hide-on-click-modal />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="imageType" label="图片分类" width="100" :formatter="formatter" />
        <el-table-column prop="path" label="url" />
        <el-table-column prop="size" label="图片大小" width="100" :formatter="formatter" />
        <el-table-column prop="remark" label="备注" width="100"/>
        <el-table-column prop="createTime" label="创建时间" width="180"/>
        <el-table-column prop="updateTime" label="更新时间" width="180"/>
        <el-table-column label="操作" width="100">
          <template #header>
            <span style="margin-right: 5px">操作</span>
            <CreateButton v-has-perm="'vgK0'" title="新增图片" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'I2K0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'F2K0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
  <ImageForm ref="imageRef" @reload="getPage"></ImageForm>
</template>
<script setup>
import { deleteApi, listPageApi } from '@/api/system/image';
import { Delete, Edit } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import ImageForm from './ImageForm.vue';
import useUserStore from '@/store/user';
import useDictStore from '@/store/dict.js';
import CreateButton from '@/components/CreateButton.vue';

const userStore = useUserStore();
const dictStore = useDictStore();
const dictList = dictStore.getDict('image_type');
const selectAuth = userStore.hasAuth('ogK0');
const loading = ref(false);
const total = ref(0);
const imageRef = ref();
const pageData = ref([]);

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  imageType: null
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
  imageRef.value.openDialog(row);
};

const handleDelete = (row) => {
  confirmMsg('确定要删除该图片吗?', () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('图片删除成功');
      getPage();
    });
  });
};

const formatter = (_row, column, cellValue) => {
  if (column.property === 'size') {
    return (cellValue / 1024).toFixed(1) + 'KB';
  } else if (column.property === 'imageType') {
    return dictStore.parseDict('image_type', cellValue);
  } else {
    return cellValue;
  }
};

const handleCreate = () => {
  imageRef.value.openDialog({});
};
</script>
