<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="500px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
      v-loading="loading">
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="formData.icon" show-word-limit />
      </el-form-item>
      <el-form-item label="菜单级别" prop="grade">
        <el-select v-model="formData.grade">
          <el-option label="导航菜单" :value="1"></el-option>
          <el-option label="按钮菜单" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="formData.path" show-word-limit maxlength="50" />
      </el-form-item>
      <el-form-item label="权限URL" prop="subPath">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="formData.subPath" autosize
          maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="formData.state">
          <el-option label="启用" :value="true"></el-option>
          <el-option label="禁用" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="显示状态" prop="state">
        <el-select v-model="formData.state">
          <el-option label="商户显示" :value="1" title="表示菜单或按钮只对商户开放"></el-option>
          <el-option label="系统显示" :value="2" title="表示菜单或按钮只对系统人员开放"></el-option>
          <el-option label="全部显示" :value="3" title="表示菜单或按钮对商户和系统人员都开放"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" v-model="formData.remark" autosize
          maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click=" showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { createApi, updateApi } from '@/api/system/menu';
import { reactive, ref } from 'vue';

const loading = ref(false);
const dialogTitle = ref("");
const formDataRef = ref();
const showDialog = ref(false);

const emit = defineEmits(['reload']);

const formRules = reactive({
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' }
  ]
})

const formData = ref({
  id: null,
  title: "",
  state: true,
  icon: "",
  pid: "",
  path: "",
  subPath: "",
  sort: 999,
  displayState: 1,
  remark: ""
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = "编辑角色";
    formData.value = {...row};
  } else {
    dialogTitle.value = "新增角色";
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    roleName: "",
    remark: ""
  }
  formDataRef.value?.resetFields();
}

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value).then(res => {
          ElMessage.success("修改角色成功");
          showDialog.value = false;
          emit('reload');
        }).finally(() => {
          loading.value = false;
        })
      } else {
        createApi(formData.value).then(res => {
          ElMessage.success("新增角色成功");
          showDialog.value = false;
          emit('reload');
        }).finally(() => {
          loading.value = false;
        })
      }
    }
  })
}

defineExpose({
  openDialog
})

</script>
