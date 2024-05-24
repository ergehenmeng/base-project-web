<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="80px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="字典名称、字典编码" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.locked" clearable>
            <el-option label="可编辑" value="false" />
            <el-option label="不可编辑" value="true" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item class="right-button" v-has-perm="'AmK0'">
          <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <el-table :data="pageData" style="width: 100%" stripe v-loading="loading" max-height="670" show-overflow-tooltip>
        <el-table-column type="expand">
          <template #default="props">
            <div style="padding: 0 50px;">
              <span class="dict-item-title">子项列表</span>
              <el-table :data="props.row.itemList" border>
                <el-table-column label="显示值" prop="showValue" />
                <el-table-column label="隐藏值" prop="hiddenValue" title="保存数据库的值"/>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button v-has-perm="'rmK0'" type="primary" :icon="Edit" @click="handleItemEdit(scope.row)" link title="编辑">
                    </el-button>
                    <el-button v-has-perm="'RmK0'" type="danger" :icon="Delete" @click="handleItemDelete(scope.row)" link title="删除">
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="字典名称"/>
        <el-table-column prop="nid" label="字典编码"/>
        <el-table-column prop="locked" label="状态" :formatter="formatter"/>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-has-perm="'9mK0'" type="primary" :icon="CirclePlus" @click="handleItemCreate(scope.row)" link title="添加数据字典子项">
            </el-button>
            <el-button v-has-perm="'rmK0'" type="primary" :icon="Edit" @click="handleEdit(scope.row)" link title="编辑">
            </el-button>
            <el-button v-has-perm="'RmK0'" type="danger" :icon="Delete" @click="handleDelete(scope.row)" link
                       title="删除">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="queryParams.page" v-model:page-size="queryParams.pageSize"
                     :page-sizes="[10, 20, 50]" layout="->, total, sizes, prev, pager, next" :total="total" @change="getPage" />
    </div>
  </div>
  <DickForm ref="dictRef" @reload="getPage"></DickForm>
  <ItemForm ref="itemRef" @reload="getPage"></ItemForm>
</template>
<script setup>
import { listPageApi, deleteApi, deleteItemApi } from '@/api/system/dict';
import { onMounted, reactive, ref } from 'vue';
import { Edit, Delete, Plus, CirclePlus } from '@element-plus/icons-vue';
import { confirmMsg } from '@/utils/message';
import DickForm from './DickForm.vue';
import ItemForm from './ItemForm.vue';
import useUserStore from '@/store/user';

const userStore = useUserStore();
const loading = ref(false)
const total = ref(0);
const dictRef = ref();
const itemRef = ref();
const pageData = ref([]);

const queryParams = reactive({
  queryName: "",
  page: 1,
  pageSize: 10,
  locked: null
})

const getPage = async () => {
  loading.value = true;
  try {
    if (userStore.hasAuth('GmK0')) {
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



const handleEdit = (row) => {
  dictRef.value.openDialog(row);
}

const handleDelete = (row) => {
  confirmMsg("确定要删除该图片吗?", () => {
    const data = { id: row.id };
    deleteApi(data).then(res => {
      getPage();
    })
  })
}

const formatter = (row, column, cellValue) => {
  if (column.property === "locked") {
    return cellValue ? "不可编辑" : "可编辑";
  } else {
    return cellValue;
  }
}

const handleCreate = () => {
  dictRef.value.openDialog({});
}

const handleItemCreate = (row) => {
  itemRef.value.openDialog(row);
}

const handleItemEdit = (row) => {
  itemRef.value.openDialog(row);
}

const handleItemDelete = (row) => {
  confirmMsg("确定要删除该子项数据吗?", () => {
    const data = { id: row.id };
    deleteItemApi(data).then(res => {
      getPage();
    })
  })
}

</script>
<style lang='scss' scoped>
.el-pagination {
  margin: 10px 10px 0 0;
}

.dict-item-title {
  font: bold 14px "Microsoft YaHei";
  display: block;
  margin-bottom: 10px;
}
</style>
