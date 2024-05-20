<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="请输入内容" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.locked" >
            <el-option label="全部" value="" />
            <el-option label="禁止编辑" value="true" />
            <el-option label="可编辑" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="conetent-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column prop="title" label="参数名称" width="250" />
        <el-table-column prop="nid" label="标示符" width="250" />
        <el-table-column prop="content" label="配置信息" width="300" />
        <el-table-column prop="remark" label="备注信息" />
        <el-table-column prop="locked" label="状态" width="100" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.$index, scope.row)" :icon="Edit" title="编辑" link></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50]" layout="->, total, sizes, prev, pager, next" :total="total" @change="getPage" />
    </div>
  </div>
</template>
<script setup>
import { listPageApi } from '@/api/system';
import { onMounted, reactive, ref } from 'vue';
import { Edit } from '@element-plus/icons-vue';
const loading = ref(false)
const total = ref(0);

const queryParams = reactive({
  queryName: "",
  page: 1,
  pageSize: 10,
  locked: null
})

const pageData = ref([]);

const getPage = async () => {
  loading.value = true;
  try {
    const { data } = await listPageApi(queryParams);
    pageData.value = data.rows;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

const search = () => {
  queryParams.page = 1;
  getPage()
}

onMounted(() => {
  getPage();
})

const handleEdit = (row) => {
  console.log(row)
}

</script>
<style lang='scss' scoped>
.el-pagination {
  margin: 10px 10px 0 0;
}
</style>
