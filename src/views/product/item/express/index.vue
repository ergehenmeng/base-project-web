<template>
  <div class="content-top">
    <el-form :inline="true" label-width="70px">
      <el-form-item style="margin-left: 20px" v-has-perm="'RfO0'">
        <el-button type="primary" :icon="Plus" @click="handleCreate">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="content-main" style="padding: 30px">
    <el-collapse>
      <el-collapse-item v-for="item in expressList" :name="item.id" :key="item.id">
        <template #title>
          <div style="width: 100%">
            <div style="float: left">
              <h3>{{ item.title }}</h3>
            </div>
            <div style="float: right; margin-right: 30px">
              <el-text style="margin-right: 20px">
                <span style="margin-right: 20px" v-if="item.state === 1">状态：<span style="color: #67c23a">启用</span></span>
                <span style="margin-right: 20px" v-else>状态：<span style="color: #f56c6c">禁用</span></span>
                <span style="margin-right: 20px">创建时间：{{ item.createTime }}</span>
                <span>更新时间：{{ item.updateTime }}</span>
              </el-text>
              <el-button v-has-perm="'9fO0'" type="primary" :icon="Edit" @click="handleEdit(item)" link title="编辑"></el-button>
              <el-button v-has-perm="'afO0'" type="danger" :icon="Delete" @click="handleDelete(item)" link title="删除"></el-button>
            </div>
          </div>
        </template>
        <div>
          <el-table :data="item.regionList" stripe show-overflow-tooltip>
            <el-table-column prop="regionName" label="区域名称" width="400"></el-table-column>
            <el-table-column prop="firstPart" label="首件或首重"></el-table-column>
            <el-table-column prop="firstPrice" label="首件或首重的价格(元)"></el-table-column>
            <el-table-column prop="nextPart" label="续重或续件"></el-table-column>
            <el-table-column prop="nextUnitPrice" label="续重或续件的单价(元)"></el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { deleteApi, listApi } from '@/api/product/express';
import { Delete, Edit, Plus } from '@element-plus/icons-vue';
import useUserStore from '@/store/user.js';
import { useRouter } from 'vue-router';
import { confirmMsg, successMsg } from '@/utils/message.js';

const router = useRouter();
const userStore = useUserStore();
const selectAuth = userStore.hasAuth('rfO0');
const expressList = ref([]);

const handleCreate = () => {
  router.push('/product/express/create');
};
const handleEdit = (item) => {
  router.push('/product/express/edit/' + item.id);
};
const handleDelete = (item) => {
  confirmMsg('确定要删除该快递模板吗?', () => {
    deleteApi({ id: item.id }).then((res) => {
      successMsg('快递模板删除成功');
      getPage();
    });
  });
};
onMounted(() => {
  getPage();
});

const getPage = () => {
  if (selectAuth) {
    listApi().then((res) => {
      expressList.value = res.data;
    });
  }
};
</script>
