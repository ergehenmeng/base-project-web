<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="旅行社名称" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.state" clearable>
            <el-option label="待上架" :value="0" />
            <el-option label="已上架" :value="1" />
            <el-option label="强制下架" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item class="right-button" v-has-perm="'CEO0'">
          <el-button type="primary"  :icon="Plus" @click="handleCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="coverUrl" label="店铺logo" width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image fit="contain" :src="scope.row.logoUrl"
                        style="width: 50px;height: 50px;" preview-teleported hide-on-click-modal />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="旅行社名称" min-width="200" />
        <el-table-column prop="coverUrl" label="封面图" width="100">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-image fit="contain" :src="scope.row.coverUrl?.split(',')[0]" :preview-src-list="scope.row.coverUrl?.split(',')"
                        style="width: 50px;height: 50px;" preview-teleported hide-on-click-modal />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="100" :formatter="formatter"/>
        <el-table-column prop="phone" label="旅行社电话" width="120" />
        <el-table-column prop="score" label="评分" width="80"/>
        <el-table-column prop="detailAddress" label="详细地址" width="250" />
        <el-table-column prop="createTime" label="创建时间" width="180"/>
        <el-table-column prop="updateTime" label="更新时间" width="180"/>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <el-button v-has-perm="'tEO0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情">
            </el-button>
            <el-button v-has-perm="'zEO0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑">
            </el-button>
            <el-button v-has-perm="'QEO0'" v-if="scope.row.state === 0"  type="success" :icon="Top" @click="handleShelves(scope.row)" link title="上架">
            </el-button>
            <el-button v-has-perm="'VEO0'" v-if="scope.row.state === 1"  type="warning" :icon="Bottom" @click="handleUnShelves(scope.row)" link title="下架">
            </el-button>
            <el-button v-has-perm="'xEO0'" v-if="scope.row.state !== 2"  type="danger" :icon="Download" @click="handlePlatformUnShelves(scope.row)" link title="强制下架">
            </el-button>
            <el-button v-has-perm="'JEO0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize"
                     :page-sizes="[10, 20, 50]" layout="->, total, sizes, prev, pager, next" :total="total" @change="getPage" />
    </div>
  </div>
</template>
<script setup>
import { listPageApi, deleteApi, shelvesApi, unShelvesApi, platformUnShelvesApi } from '@/api/product/travel';
import { onMounted, reactive, ref } from 'vue';
import {Edit, Delete, Plus, Top, Bottom, Download, Document} from '@element-plus/icons-vue';
import {confirmMsg, successMsg} from '@/utils/message';
import useUserStore from '@/store/user';
import {useRouter} from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth("1EO0");
const queryParams = reactive({
  queryName: "",
  page: 1,
  pageSize: 10,
  state: null
})

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
}

const search = () => {
  queryParams.page = 1;
  getPage()
}

onMounted(() => {
  getPage()
})

const handleDelete = (row) => {
  confirmMsg("确定要删除该旅行社吗?", () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('旅行社删除成功');
      getPage();
    })
  })
}

const formatter = (row, column, cellValue) => {
  if (column.property === "state") {
    if (cellValue === 0) {
      return "待上架";
    }
    return cellValue === 1 ? h('span', { style: 'color: green;' }, '已上架') : h('span', { style: 'color: red;' }, '强制下架');
  } else {
    return cellValue;
  }
}

const handleShelves = (row) => {
  confirmMsg("确定要上架该旅行社吗?", () => {
    const data = { id: row.id };
    shelvesApi(data).then(() => {
      successMsg('旅行社上架成功');
      getPage();
    })
  })
}

const handleUnShelves = (row) => {
  confirmMsg("确定要下架该旅行社吗?", () => {
    const data = { id: row.id };
    unShelvesApi(data).then(() => {
      successMsg('旅行社下架成功');
      getPage();
    })
  })
}

const handlePlatformUnShelves = (row) => {
  confirmMsg("确定要强制下架该旅行社吗?", () => {
    const data = { id: row.id };
    platformUnShelvesApi(data).then(() => {
      successMsg('旅行社强制下架成功');
      getPage();
    })
  })
}

const handleCreate = () => {
  router.push("/product/travel/create");
}

const handleEdit = (row) => {
  router.push("/product/travel/edit/" + row.id);
}

const handleDetail = (row) => {
  router.push("/product/travel/detail/" + row.id);
}

</script>

