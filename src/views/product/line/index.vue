<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="线路名称" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="旅行社">
          <el-select v-model="queryParams.travelAgencyId" style="width: 250px !important;" clearable>
            <el-option v-for="item in travelList" :key="item.id" :value="item.id" :label="item.title" />
          </el-select>
        </el-form-item>
        <el-form-item label="游玩时间">
          <el-select v-model="queryParams.duration" clearable>
            <el-option label="一日游" :value="1" />
            <el-option label="二日游" :value="2" />
            <el-option label="三日游" :value="3" />
            <el-option label="四日游" :value="4" />
            <el-option label="五日游" :value="5" />
            <el-option label="六日游" :value="6" />
            <el-option label="七日游" :value="7" />
            <el-option label="八日游" :value="8" />
            <el-option label="九日游" :value="9" />
            <el-option label="十日游" :value="10" />
            <el-option label="十一日游" :value="11" />
            <el-option label="十二日游" :value="12" />
            <el-option label="十三日游" :value="13" />
            <el-option label="十四日游" :value="14" />
            <el-option label="十五日游" :value="15" />
          </el-select>
        </el-form-item>
        <el-form-item label="票种">
          <ProvinceCitySelect v-model="queryParams.areaList"></ProvinceCitySelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item class="right-button" v-has-perm="'hTl0'">
          <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="线路名称" min-width="200" />
        <el-table-column prop="scenicName" label="所属景区" min-width="200"/>
        <el-table-column prop="category" label="票种" width="80" :formatter="formatter"/>
        <el-table-column prop="state" label="状态" width="80" :formatter="formatter"/>
        <el-table-column prop="salePrice" label="销售价" width="80" :formatter="formatter"/>
        <el-table-column prop="saleNum" label="真实销量" width="80" />
        <el-table-column prop="startDate" label="可预订时间" width="180" :formatter="formatter"/>
        <el-table-column prop="stock" label="剩余库存" width="80" />
        <el-table-column prop="advanceDay" label="提前几天购票" width="120" :formatter="formatter"/>
        <el-table-column prop="verificationType" label="核销方式" width="120" :formatter="formatter"/>
        <el-table-column prop="realBuy" label="是否实名" width="100" :formatter="formatter"/>
        <el-table-column prop="createTime" label="创建时间" width="180"/>
        <el-table-column prop="updateTime" label="更新时间" width="180"/>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <el-button v-has-perm="'iTl0'" type="info" :icon="Document" @click="handleDetail(scope.row)" link title="详情">
            </el-button>
            <el-button v-has-perm="'XTl0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑">
            </el-button>
            <el-button v-has-perm="'qTl0'" v-if="scope.row.state === 0" type="success" :icon="Top" @click="handleShelves(scope.row)" link title="上架">
            </el-button>
            <el-button v-has-perm="'8Tl0'" v-if="scope.row.state === 1" type="warning" :icon="Bottom" @click="handleUnShelves(scope.row)" link title="下架">
            </el-button>
            <el-button v-has-perm="'gTl0'" v-if="scope.row.state !== 2 " type="danger" :icon="Download" @click="handlePlatformUnShelves(scope.row)" link title="强制下架">
            </el-button>
            <el-button v-has-perm="'2Tl0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link title="删除">
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
import { listPageApi, deleteApi, shelvesApi, unShelvesApi, platformUnShelvesApi, travelListApi } from '@/api/product/line';
import { onMounted, reactive, ref } from 'vue';
import {Edit, Delete, Plus, Top, Bottom, Download, Document} from '@element-plus/icons-vue';
import {confirmMsg, successMsg} from '@/utils/message';
import useUserStore from '@/store/user';
import {useRouter} from "vue-router";
import ProvinceCitySelect from "@/components/ProvinceCitySelect.vue";

const travelList = ref([]);
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const total = ref(0);
const pageData = ref([]);
const selectAuth = userStore.hasAuth("pTl0");
const queryParams = reactive({
  queryName: null,
  page: 1,
  pageSize: 10,
  state: null,
  travelAgencyId: null,
  category: null,
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
  confirmMsg("确定要删除该线路吗?", () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('线路删除成功');
      getPage();
    })
  })
}

const formatter = (row, column, cellValue) => {
  if (column.property === "category") {
    switch (cellValue) {
      case 1:
        return "成人票";
      case 2:
        return "老人票";
      case 3:
        return "儿童票";
      default:
        return "无";
    }
  } else if (column.property === "state") {
    if (cellValue === 0) {
      return "待上架";
    }
    return cellValue === 1 ? h('span', { style: 'color: green;' }, '已上架') : h('span', { style: 'color: red;' }, '强制下架');
  } else if (column.property === "startDate") {
    return row.startDate + "~" + row.endDate;
  } else if (column.property === "verificationType") {
    return cellValue === 1 ? h('span', { style: 'color: green;', title: "核销端核销"}, '手动核销') : h('span', { style: 'color: green;', title: "次日凌晨0点开始核销"}, '自动核销');
  } else if (column.property === "realBuy") {
    return cellValue ? "是" : "否";
  } else if (column.property === "advanceDay") {
    return cellValue + "天";
  } else {
    return cellValue;
  }
}

const handleShelves = (row) => {
  confirmMsg("确定要上架该线路吗?", () => {
    const data = { id: row.id };
    shelvesApi(data).then(() => {
      successMsg('线路上架成功');
      getPage();
    })
  })
}

const handleUnShelves = (row) => {
  confirmMsg("确定要下架该线路吗?", () => {
    const data = { id: row.id };
    unShelvesApi(data).then(() => {
      successMsg('线路下架成功');
      getPage();
    })
  })
}

const handlePlatformUnShelves = (row) => {
  confirmMsg("确定要强制下架该线路吗?", () => {
    const data = { id: row.id };
    platformUnShelvesApi(data).then(() => {
      successMsg('线路强制下架成功');
      getPage();
    })
  })
}

const handleCreate = () => {
  router.push("/product/line/create");
}

const handleEdit = (row) => {
  router.push("/product/line/edit/" + row.id);
}

const handleDetail = (row) => {
  router.push("/product/line/detail/" + row.id);
}

onMounted(() => {
  if (selectAuth) {
    travelListApi().then(res => {
      travelList.value = res.data;
    })
  }
})

</script>

