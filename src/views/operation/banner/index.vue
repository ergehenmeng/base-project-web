<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="标题" clearable @keyup.enter="search" maxlength="30" />
        </el-form-item>
        <el-form-item label="轮播类型">
          <el-select v-model="queryParams.bannerType" clearable>
            <el-option v-for="item in dictList" :key="item.id" :label="item.showValue" :value="item.hiddenValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="客户端">
          <el-select v-model="queryParams.clientType" clearable>
            <el-option label="PC" value="PC" />
            <el-option label="ANDROID" value="ANDROID" />
            <el-option label="IOS" value="IOS" />
            <el-option label="H5" value="H5" />
            <el-option label="WECHAT" value="WECHAT" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="正常" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="播放时间">
          <el-date-picker v-model="queryParams.middleTime" time-format="HH:mm" format="YYYY-MM-DD HH:mm"  value-format="YYYY-MM-DD HH:mm" type="datetime" placeholder="在此时间段内有效的轮播图" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="标题" min-width="120" />
        <el-table-column prop="imgUrl" label="预览" width="60">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image fit="cover" :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]" style="width: 30px; height: 30px" preview-teleported hide-on-click-modal />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="bannerType" label="轮播图类型" :formatter="formatter" width="120" />
        <el-table-column prop="state" label="状态" width="80">
          <template #default="scope">
            <el-switch
              v-model="scope.row.state"
              inline-prompt
              :active-value="true"
              :inactive-value="false"
              active-text="正常"
              inactive-text="禁用"
              @change="updateState(scope.row)"
              :disabled="!stateAuth"
              style="--el-switch-off-color: #ff4949"
            />
          </template>
        </el-table-column>
        <el-table-column prop="clientType" label="客户端类型" width="100" />
        <el-table-column prop="startTime" label="显示时间段" width="280" :formatter="formatter"/>
        <el-table-column prop="click" label="是否点击" width="80">
          <template #default="scope">
            <el-switch v-model="scope.row.click" inline-prompt active-text="是" inactive-text="否" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="jumpUrl" label="跳转地址" min-width="150" />
        <el-table-column prop="sort" label="排序" width="75">
          <template #default="scope">
            <el-input v-model="scope.row.sort" @change="handleSort(scope.row)" maxlength="3" :readonly="!sortAuth" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="100" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column prop="updateTime" label="更新时间" width="160" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #header>
            <span>操作</span>
            <CreateButton v-has-perm="'gxU0'" title="新增轮播图" @click="handleCreate"></CreateButton>
          </template>
          <template #default="scope">
            <el-button v-has-perm="'2xU0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑"></el-button>
            <el-button v-has-perm="'mxU0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除"></el-button>
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
  <BannerForm ref="bannerRef" @reload="getPage"></BannerForm>
</template>
<script setup>
import { deleteApi, listPageApi, sortApi, stateApi } from '@/api/operation/banner';
import { Delete, Edit } from '@element-plus/icons-vue';
import { confirmMsg, successMsg } from '@/utils/message';
import BannerForm from './BannerForm.vue';
import useUserStore from '@/store/user';
import useDictStore from '@/store/dict.js';
import CreateButton from '@/components/CreateButton.vue';
import { renderMsg } from '@/utils/common.js'

const userStore = useUserStore();
const dictStore = useDictStore();
const dictList = dictStore.getDict('banner_type');

const loading = ref(false);
const total = ref(0);
const bannerRef = ref();
const pageData = ref([]);
const selectAuth = userStore.hasAuth('jxU0');
const sortAuth = userStore.hasAuth('BxU0');
const stateAuth = userStore.hasAuth('7xU0');

const queryParams = reactive({
  queryName: '',
  page: 1,
  pageSize: 10,
  state: null,
  bannerType: null,
  clientType: null,
  middleTime: null
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

const handleSort = (row) => {
  const data = { id: row.id, sortBy: row.sort };
  sortApi(data).then(() => {
    getPage();
  });
};

const updateState = (row) => {
  stateApi({ id: row.id, state: row.state });
};

const handleEdit = (row) => {
  bannerRef.value.openDialog(row);
};

const handleDelete = (row) => {
  const msg = renderMsg(["确定要", () => "删除", "该轮播图吗?"]);
  confirmMsg(msg, () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('轮播图删除成功');
      getPage();
    });
  });
};

const formatter = (row, column, cellValue) => {
  if (column.property === 'bannerType') {
    return dictStore.parseDict('banner_type', cellValue);
  } else if (column.property === 'startTime') {
    return cellValue + "~" + row.endTime;
  } else {
    return cellValue;
  }
};
const handleCreate = () => {
  bannerRef.value.openDialog({});
};
</script>
