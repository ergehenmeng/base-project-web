<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
      v-loading="loading">
      <el-form-item label="用户名称" prop="nickName">
        <el-input v-model="formData.nickName" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" maxlength="11" />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="formData.roleIds" filterable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3"
          clearable title="注意:此处只显示系统角色,不显示商户角色">
          <el-option v-for="role in roleList" :label="role.desc" :value="role.value" :key="role.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptCode">
        <el-select v-model="formData.deptCode" clearable>
          <el-option label="研发部" :value="1"></el-option>
          <el-option label="设计部" :value="2"></el-option>
          <el-option label="测试部" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据权限" prop="dataType">
        <el-select v-model="formData.dataType" clearable>
          <el-option label="本人数据" :value="1"></el-option>
          <el-option label="本部门数据" :value="2"></el-option>
          <el-option label="本部门及子部门数据" :value="4"></el-option>
          <el-option label="所有数据" :value="8"></el-option>
          <el-option label="自定义数据" :value="16"></el-option>
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
import { roleListApi, updateApi, createApi } from '@/api/system/user';
import { reactive, ref } from 'vue';
import {successMsg} from "@/utils/message.js";

const loading = ref(false);
const dialogTitle = ref("");
const roleList = ref([]);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  nickName: [
    { required: true, message: '用户名称不能为空', trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  roleIds: [
    { required: true, message: '请选择角色', trigger: 'change', type: 'array' }
  ]
})

const formData = ref({
  id: null,
  nickName: "",
  mobile: "",
  deptCode: "",
  roleIds: [],
  dataType: null,
  remark: ""
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = "编辑用户";
    formData.value = {...row};
  } else {
    dialogTitle.value = "新增用户";
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    nickName: "",
    mobile: "",
    deptCode: "",
    roleIds: [],
    dataType: null,
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
          successMsg("修改用户成功");
          showDialog.value = false;
          emit('reload');
        }).finally(() => {
          loading.value = false;
        })
      } else {
        createApi(formData.value).then(() => {
          successMsg("新增用户成功");
          showDialog.value = false;
          emit('reload');
        }).finally(() => {
          loading.value = false;
        })
      }
    }
  })
}

const loadingRoleList = () => {
  roleListApi().then(res => {
    roleList.value = res.data;
  })
}

loadingRoleList();

defineExpose({
  openDialog
})

</script>
