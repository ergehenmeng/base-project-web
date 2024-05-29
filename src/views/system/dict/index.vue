<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="字典名称、字典编码" clearable @keyup.enter="search" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="queryParams.dictType" clearable>
            <el-option label="系统字典" value="1" />
            <el-option label="系统字典" value="2" />
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
            <div style="padding: 0 55px;">
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
        <el-table-column prop="dictType" label="分类" :formatter="formatter"/>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button v-has-perm="'9mK0'" type="success" :icon="CirclePlus" @click="handleItemCreate(scope.row)" link title="添加数据字典子项">
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
import {confirmMsg, successMsg} from '@/utils/message';
import DickForm from './DickForm.vue';
import ItemForm from './ItemForm.vue';
import useUserStore from '@/store/user';

const userStore = useUserStore();
const selectAuth = userStore.hasAuth('GmK0');
const loading = ref(false);
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
  confirmMsg("确定要删除该选项吗?", () => {
    const data = { id: row.id };
    deleteApi(data).then(() => {
      successMsg('字典删除成功');
      getPage();
    })
  })
}

const formatter = (row, column, cellValue) => {
  if (column.property === "dictType") {
    return cellValue === 1 ? "系统字典" : "业务字典";
  } else {
    return cellValue;
  }
}

const handleCreate = () => {
  dictRef.value.openDialog({});
}

const handleEdit = (row) => {
  dictRef.value.openDialog(row);
}

const handleItemCreate = (row) => {
  itemRef.value.openDialog({nid: row.nid});
}

const handleItemEdit = (row) => {
  itemRef.value.openDialog(row);
}

const handleItemDelete = (row) => {
  confirmMsg("确定要删除该子项数据吗?", () => {
    const data = { id: row.id };
    deleteItemApi(data).then(() => {
      successMsg('子项数据删除成功');
      getPage();
    })
  })
}

</script>
<style lang='scss' scoped>

.dict-item-title {
  font-weight: bold;
  font-size: 14px;
  display: block;
  margin-bottom: 10px;
}
</style>
