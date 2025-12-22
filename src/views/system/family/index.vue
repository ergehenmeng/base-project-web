<template>
  <div>
    <div class="content-top">
      <el-form :inline="true" label-width="70px">
        <el-form-item label="搜索">
          <el-input v-model="queryParams.queryName" placeholder="姓名" clearable maxlength="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryHandle">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Download" @click="downloadHandle" :loading="downloadLoading">下载</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-main">
      <div class="family-main" ref="containerRef" v-loading="loading">
        <vue3-tree-org ref="treeRef" :tool-bar="toolBar" :filter-node-method="filterNodeMethod" :data="treeData" :label-style="style" :props="props" center :define-menus="defineMenus" :node-add="createHandle" :node-edit="updateHandle" :node-delete="deleteHandle" >
          <template v-slot="{node}">
            <el-tooltip placement="top" effect="light" :disabled="node.pid === '0' || (!node.$$data?.birthday && !node.$$data?.remark)">
              <template #content>
                <div class="tips-container">
                  <div v-if="node.$$data?.birthday">
                    <span class="tips-label">出生：</span>
                    <span class="tips-break">{{node.$$data?.birthday}}</span>
                  </div>
                  <div v-if="node.$$data?.remark">
                    <span class="tips-label">简介：</span>
                    <span class="tips-break">{{node.$$data?.remark}}</span>
                  </div>
                </div>
              </template>
              <span v-if="node.$$data?.state" class="label-wrapper-end">
                <span class="node-label-end">{{ node.label }}</span>
              </span>
              <span v-else class="label-wrapper">
                <span class="node-label">{{ node.label }}</span>
              </span>
            </el-tooltip>
          </template>
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
import html2canvas from 'html2canvas';
import { Download } from '@element-plus/icons-vue';
const loading = ref(false);
const formRef = ref(null);
const treeData = ref({});
const permStore = usePermStore();
const selectAuth = permStore.hasAuth('zF50');
const createAuth = permStore.hasAuth('QF50');
const editAuth = permStore.hasAuth('VF50');
const deleteAuth = permStore.hasAuth('6F50');
const treeRef = ref();
const containerRef = ref();
const toolBar = ref({scale: false, restore: true, expand: false, zoom: false, fullscreen: true});
const downloadLoading = ref(false);

const style = ref({
  color: '#fff',
  background: '#409eef'
});

const queryParams = ref({
  queryName: ''
})

const props = ref({
  label: 'name',
  children: 'children',
  pid: 'pid',
  id: 'id',
  isLeaf: 'state',
  remark: 'remark'
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

const queryHandle = () => {
  treeRef.value.filter(queryParams.value.queryName);
}

const downloadHandle = async () => {
  if (!containerRef.value) {
    return;
  }
  try {
    downloadLoading.value = true
    const canvas = await html2canvas(containerRef.value, { scale: 3 });
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = treeData.value.name + '.png';
    link.click();
  } catch (e) {
    console.error('导出异常', e);
  } finally {
    downloadLoading.value = false;
  }
}

const filterNodeMethod = (value, data) => {
  if (!value) {
    return true;
  }
  return data.label.indexOf(value) !== -1;
}

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
  if (node.state) {
    errorMsg('已绝户不支持新增');
    return;
  }
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
  const msg = renderMsg(['确定要删除', () => node.name, '吗?']);
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
.node-label,.node-label-end {
  display: inline-block;
}

.label-wrapper,.label-wrapper-end {
  display: inline-block;
  padding: 5px 10px;
}

.label-wrapper-end {
  background-color: #ff5151;
}

.tips-container {
  max-width: 300px;
  line-height: 1.5;
}
.tips-label {
  display: inline-block;
  width: 40px;
  text-align: right;
  font-weight: bold;
  vertical-align: top;
}
.tips-break {
  display: inline-block;
  width: calc(100% - 40px);
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  vertical-align: top;
}
</style>