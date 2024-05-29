<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
      v-loading="loading">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="formData.roleName" show-word-limit maxlength="20" />
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
import { createApi, updateApi } from '@/api/system/role';
import { reactive, ref } from 'vue';
import {successMsg} from "@/utils/message.js";

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
  roleName: "",
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
        updateApi(formData.value).then(() => {
          successMsg("修改角色成功");
          showDialog.value = false;
          emit('reload');
        }).finally(() => {
          loading.value = false;
        })
      } else {
        createApi(formData.value).then(() => {
          successMsg("新增角色成功");
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
