<template>
  <el-dialog v-model="showDialog" width="400px" draggable align-center :close-on-click-modal="false">
    <template #header>
      <span>核销授权<QuestionTip content="授权后该用户只能核销指定的商品(注意：用户需要授权核销员相关权限)"/></span>
    </template>
    <el-scrollbar height="350px">
      <el-tree ref="treeRef" show-checkbox :data="menuList" node-key="id" :props="defaultProps" :default-expand-all="true" :default-checked-keys="checkedKeys" v-loading="loading"></el-tree>
    </el-scrollbar>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { authApi, getAuthApi } from '@/api/merchant/user/index.js';
import { successMsg } from '@/utils/message.js';
import QuestionTip from '@/components/QuestionTip.vue';

const defaultProps = {
  label: 'title',
  children: 'children'
};
const treeRef = ref();
const showDialog = ref(false);
const loading = ref(false);
const menuList = ref([]);
const checkedKeys = ref([]);
const idRef = ref(null);

const emit = defineEmits(['reload']);

const openDialog = async (row) => {
  showDialog.value = true;
  menuList.value = [];
  loading.value = true;
  idRef.value = row.id;
  try {
    // 选中的菜单
    const { data: { authList, scopeList } } = await getAuthApi({ id: row.id });
    checkedKeys.value = authList;
    menuList.value = scopeList;
  } finally {
    loading.value = false;
  }
};

const handleSave = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys(true);
  loading.value = true;
  authApi({
    id: idRef.value,
    productIds: [...checkedKeys]
  }).then(() => {
      successMsg('核销授权成功');
      showDialog.value = false;
      emit('reload');
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  openDialog
});
</script>
