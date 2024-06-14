<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="标题" clearable @keyup.enter="search"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item class="right-button" v-has-perm="'SmU0'">
          <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-tabs v-model="activeName" @tab-change="handleChange">
        <el-tab-pane v-for="config in configList" :label="config.title" :key="config.code" :name="config.code">
          <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670"
                    show-overflow-tooltip>
            <el-table-column prop="title" label="资讯标题"/>
            <el-table-column prop="depict" label="描述信息" />
            <el-table-column prop="image" label="图集">
              <template #default="scope" >
                <div style="display: flex; align-items: center">
                  <el-image fit="contain" :src="getPreview(scope.row)[0]" :preview-src-list="getPreview(scope.row)"
                            style="width: 50px;height: 50px;" preview-teleported hide-on-click-modal v-if="getPreview(scope.row).length > 0">
                  </el-image>
                  <span v-else>无</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="80">
              <template #default="scope">
                <el-input v-model="scope.row.sort" @change="handleSort(scope.row)" maxlength="3" :readonly="!sortAuth" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间"/>
            <el-table-column prop="updateTime" label="更新时间"/>
            <el-table-column label="操作" fixed="right">
              <template #default="scope">
                <el-button v-has-perm="'ymU0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link
                           title="编辑">
                </el-button>
                <el-button v-has-perm="'MmU0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link
                           title="删除">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize"
                         :page-sizes="[10, 20, 50]" layout="->, total, sizes, prev, pager, next" :total="total"
                         @change="getPage"/>

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import {listPageApi, deleteApi, configListApi, sortApi} from '@/api/operation/news';
import {onMounted, reactive, ref } from 'vue';
import {Edit, Delete, Plus} from '@element-plus/icons-vue';
import {confirmMsg, errorMsg, successMsg} from '@/utils/message';
import useUserStore from '@/store/user';
import {useRouter} from "vue-router";

const activeName = ref("");
const configList = ref([]);
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth("4mU0");
const sortAuth = userStore.hasAuth("smU0");

const queryParams = reactive({
  queryName: "",
  page: 1,
  pageSize: 10,
  code: null,
})

const getPage = async () => {
  if (!queryParams.code) {
    console.log("未配置资讯类型")
    return;
  }
  loading.value = true;
  try {
    if (selectAuth) {
      const {data} = await listPageApi(queryParams);
      pageData.value = data.rows;
      total.value = data.total;
    }
  } finally {
    loading.value = false;
  }
}

const search = () => {
  queryParams.page = 1;
  getPage()
}

const handleChange = (name) => {
  queryParams.code = name;
  search();
}

onMounted(() => {
  getConfigList().then(() => {
    if (configList.value.length > 0) {
      activeName.value = configList.value[0].code;
      queryParams.code = configList.value[0].code;
    }
    getPage();
  });
})

const getConfigList = async () => {
  const {data} = await configListApi();
  configList.value = data;
}

const handleDelete = (row) => {
  confirmMsg("确定要删除资讯信息吗?", () => {
    const data = {id: row.id};
    deleteApi(data).then(() => {
      successMsg('资讯信息删除成功');
      getPage();
    })
  })
}

const getPreview = (row) => {
  if (row.image) {
    return row.image.split(",");
  }
  return [];
}

const handleSort = (row) => {
  const data = { id: row.id, sortBy: row.sort };
  sortApi(data).then(() => {
    getPage();
  })
}

const handleCreate = () => {
  if (!activeName) {
    errorMsg("请先配置资讯类型")
    return;
  }
  router.push({
    name: "newsCreate",
    query: {
      code: activeName.value
    }
  });
}

const handleEdit = (row) => {
  router.push({
    path: "/operation/news/edit/" + row.id,
    query: {
      code: activeName.value
    }
  });
}

</script>

