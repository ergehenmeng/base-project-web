<template>
  <el-dialog title="选择区域" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-scrollbar height="400px">
      <el-tree ref="treeRef" show-checkbox :data="areaList" node-key="id" :props="defaultProps"
               :default-checked-keys="checkedKeys" :default-expanded-keys="expendKeys" v-loading="loading" >
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
import {ref} from "vue";
import useAreaStore from "@/store/area.js";
import {errorMsg} from "@/utils/message.js";

const areaStore = useAreaStore();
const treeRef = ref();
const showDialog = ref(false);
const loading = ref(false);
const checkedKeys = ref([]);
const expendKeys = ref([]);
const areaList = ref([]);
const emit = defineEmits(['reload']);

const defaultProps = {
  label: 'title',
  children: 'children'
}

const openDialog = (shieldList, selectedList) => {
  areaList.value = getNoCheckedChildren(areaStore.areaList, shieldList);
  checkedKeys.value = selectedList;
  showDialog.value = true;
}

const getNoCheckedChildren = (areaList, shieldList) => {
  if (shieldList.length === 0) {
    return areaList;
  }
  const nodeList = [];
  areaList.forEach(item => {
    if (item.children.length > 0) {
      const children = getNoCheckedChildren(item.children, shieldList)
      if (children.length > 0) {
        item.children = children;
        nodeList.push(item);
      }
    } else {
      if (!shieldList.includes(item.id)) {
        nodeList.push(item);
      }
    }
  });
  return nodeList;
}

const handleSave = () => {
  let regionList = [];
  const getCheckedNodes = treeRef.value?.getCheckedNodes(false, false);
  if (getCheckedNodes.length === 0) {
    errorMsg("请选择区域");
    return;
  }
  const getHalfCheckedNodes = treeRef.value?.getHalfCheckedNodes(false);
  if (getHalfCheckedNodes.length === 0) {
    regionList = getCheckedNodes.filter(item => item.pid === '0').map(item => item.title);
  } else {
    const halfKeys = treeRef.value?.getHalfCheckedNodes(false);
    regionList = getCheckedNodes.filter(item => item.pid === '0').filter(item => !halfKeys.includes(item.id)).map(item => item.title);
    getHalfCheckedNodes.forEach(item => {
      const children = getCheckedNodes.filter(child => child.pid === item.id).map(child => child.title);
      regionList.push(...children);
    })
  }
  const checkedKeys = treeRef.value?.getCheckedKeys(false);
  emit('reload', {regionName: regionList.join(','), regionCode: checkedKeys.join(',')})
  showDialog.value = false;
}

defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>

</style>