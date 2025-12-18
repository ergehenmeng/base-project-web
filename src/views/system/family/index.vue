<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input placeholder="参数名称、标示符、备注" clearable maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <div class="family-main" v-loading="loading">
        <vue3-tree-org :data="treeData" :label-style="style" :props="props" center :define-menus="defineMenus" :node-add="createHandle" :node-edit="updateHandle" :node-delete="deleteHandle" >
        </vue3-tree-org>
      </div>
    </div>
  </div>
  <FamilyForm ref="formRef" @reload="refreshHandle"/>
</template>
<script setup>
import { Vue3TreeOrg } from 'vue3-tree-org';
import FamilyForm from './FamilyForm.vue';
import { listApi, deleteApi } from '@/api/system/family';
import usePermStore from '@/store/perm.js';
import { renderMsg, upsert } from '@/utils/common.js';
import { confirmMsg, errorMsg, successMsg } from '@/utils/message.js';
const loading = ref(false);
const formRef = ref(null);
const treeData = ref({});
const permStore = usePermStore();
const selectAuth = permStore.hasAuth('zF50');
const createAuth = permStore.hasAuth('QF50');
const editAuth = permStore.hasAuth('VF50');
const deleteAuth = permStore.hasAuth('6F50');
const style = ref({
  color: '#fff',
  background: '#409eef'
});
const props = ref({
  label: 'name',
  children: 'children',
  pid: 'pid',
  id: 'id',
  isLeaf: 'state'
});

const defineMenus = () => {
  const menus = [{ name: '复制', command: 'copy' }];
  if (createAuth) {
    menus.push({ name: '新建', command: 'add' });
  }
  if (editAuth) {
    menus.push({ name: '编辑', command: 'edit' });
  }
  if (deleteAuth) {
    menus.push({ name: '删除', command: 'delete' });
  }
  return menus;
};

const getList = async () => {
  loading.value = true;
  try {
    if (selectAuth) {
      const { data } = await listApi();
      treeData.value = data;
    }
  } finally {
    loading.value = false;
  }
};

const createHandle = (node) => {
  formRef.value.openDialog(node, true);
};

const updateHandle = (node) => {
  if (node.pid === '0') {
    errorMsg('根节点禁止编辑');
    return;
  }
  formRef.value.openDialog(node, false);
};

const deleteHandle = (node) => {
  if (node.disabled || node.pid === '0') {
    errorMsg('根节点禁止删除');
    return;
  }
  const msg = renderMsg(['确定要', () => '删除' + node.name, '吗?']);
  confirmMsg(msg, () => {
    const data = { id: node.id };
    deleteApi(data).then(() => {
      successMsg('删除成功');
      treeData.value.children = deleteNode(treeData.value.children, node.id);
    });
  });
};

const deleteNode = (nodes, targetId) => {
  return nodes.filter((node) => {
    if (node.id === targetId) {
      return false;
    }
    if (node.children) {
      node.children = deleteNode(node.children, targetId);
    }
    return true;
  });
};

const refreshHandle = (node) => {
  addNodeHandle(treeData.value.children, node)
}

const addNodeHandle = (nodeList, n) => {
  for (const node of nodeList) {
    if (node.id === n.pid) {
      if (node.children && node.children.length > 0) {
        node.children = upsert(node.children, {
          id: n.id,
          name: n.name,
          pid: n.pid,
          state: n.state,
          remark: n.remark
        });
      } else {
        node.children = [{
          id: n.id,
          name: n.name,
          pid: n.pid,
          state: n.state,
          remark: n.remark
        }]
      }
    } else if (node.children) {
      addNodeHandle(node.children, n);
    }
  }
}

onMounted(() => {
  getList();
});

</script>
<style lang="scss" scoped>
.family-main {
  height: 670px;
}
</style>