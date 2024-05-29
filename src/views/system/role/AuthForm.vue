<template>
  <el-dialog title="角色授权" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-scrollbar height="400px">
      <el-tree class="role-menu-auth" ref="treeRef" show-checkbox :data="menuList" node-key="id" :props="defaultProps"
        :default-checked-keys="checkedKeys" :default-expanded-keys="expendKeys" v-loading="loading">
      </el-tree>
    </el-scrollbar>
    <template #footer>
      <span>
        <el-button @click=" showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { merchantMenuApi, roleMenuApi, systemMenuApi, authApi } from '@/api/system/role';
import useUserStore from '@/store/user';
import { ref } from 'vue';
import {successMsg} from "@/utils/message.js";

const defaultProps = {
  label: 'title',
  children: 'children'
}
const treeRef = ref();
const showDialog = ref(false);
const loading = ref(false);
const menuList = ref([]);
const userStore = useUserStore();
const checkedKeys = ref([]);
const expendKeys = ref([]);
const roleIdRef = ref(null);

const emit = defineEmits(['reload']);

const openDialog = async (row) => {
  showDialog.value = true;
  menuList.value = [];
  loading.value = true;
  roleIdRef.value = row.id;
  try {
    // 选中的菜单
    const { data } = await roleMenuApi({ id: row.id });
    checkedKeys.value = data;
    const userType = userStore.user.userType;
    let menuResp;
    // 所有菜单
    if (userType === 1) {
      menuResp = await systemMenuApi();
    } else {
      menuResp = await merchantMenuApi();
    }
    menuList.value = menuResp.data;
    // 默认展开第一个选项
    if (data.length > 0) {
      expendKeys.value = [data[0]]
    } else {
      expendKeys.value = [];
    }
  } finally {
    loading.value = false;
  }
}

const handleSave = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys(false);
  const checkedHalfKeys = treeRef.value?.getHalfCheckedKeys(false);
  loading.value = true;
  authApi({
    roleId: roleIdRef.value,
    menuIds: [...checkedKeys, ...checkedHalfKeys]
  }).then(() => {
    successMsg("角色授权成功");
    showDialog.value = false;
    emit('reload');
  }).finally(() => {
    loading.value = false;
  })
}

defineExpose({
  openDialog
})

</script>
