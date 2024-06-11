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

const areaStore = useAreaStore();
const treeRef = ref();
const showDialog = ref(false);
const loading = ref(false);
const checkedKeys = ref([]);
const expendKeys = ref([]);
const areaList = areaStore.areaList;
const emit = defineEmits(['reload']);

const defaultProps = {
  label: 'title',
  children: 'children'
}

const openDialog = async (row) => {
  showDialog.value = true;
}

const regionList = ref([]);

const handleSave = () => {
  regionList.value = [];
  const getCheckedNodes = treeRef.value?.getCheckedNodes(false, false);
  const getHalfCheckedNodes = treeRef.value?.getHalfCheckedNodes(false);
  if (getHalfCheckedNodes.length === 0) {
    regionList.value = getCheckedNodes.filter(item => item.pid === '0').map(item => item.title);
  } else {
    const halfKeys = treeRef.value?.getHalfCheckedNodes(false);
    regionList.value = getCheckedNodes.filter(item => item.pid === '0').filter(item => !halfKeys.includes(item.id)).map(item => item.title);
    getHalfCheckedNodes.forEach(item => {
      const children = getCheckedNodes.filter(child => child.pid === item.id).map(child => child.title);
      regionList.value.push(...children);
    })
  }
  console.log(regionList.value);
}


defineExpose({
  openDialog
})
</script>

<style lang="scss" scoped>

</style>