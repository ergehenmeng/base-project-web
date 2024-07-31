<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :validate-on-rule-change="false">
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="formData.nickName" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" show-word-limit maxlength="11" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" placeholder="密码必须包含英文字符、数字、@#&_" type="password" show-word-limit maxlength="20" >
          <template #suffix>
            <QuestionTip content="注意：编辑时，该字段填写后会覆盖旧密码"></QuestionTip>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="formData.roleIds" filterable multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3" clearable>
          <el-option v-for="role in roleList" :label="role.desc" :value="role.value" :key="role.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="formData.remark" maxlength="100" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { createApi, roleIdsApi, updateApi } from '@/api/merchant/user';
import { roleListApi } from '@/api/system/user';
import { successMsg } from '@/utils/message.js';
import QuestionTip from '@/components/QuestionTip.vue'

const loading = ref(false);
const dialogTitle = ref('');
const roleList = ref([]);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  nickName: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
  mobile: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#&_]).{6,20}$/,
      message: '密码必须包含英文字符、数字、@#&_',
      trigger: 'blur'
    }
  ],
  roleIds: [{ required: true, message: '请选择角色', trigger: 'change', type: 'array' }]
});

const formData = ref({
  id: null,
  nickName: null,
  mobile: null,
  password: null,
  roleIds: [],
  remark: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑用户';
    formData.value = { ...row };
    roleIdsApi({id: row.id}).then((res) => {
      formData.value.roleIds = res.data;
    });
    formRules.password = [
      { required: false, message: '', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
      {
        pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#&_]).{6,20}$/,
        message: '密码必须包含英文字符、数字、@#&_',
        trigger: 'blur'
      }
    ]
  } else {
    dialogTitle.value = '新增用户';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    nickName: null,
    mobile: null,
    password: null,
    roleIds: [],
    remark: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('修改用户成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增用户成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

const loadingRoleList = () => {
  roleListApi().then((res) => {
    roleList.value = res.data;
  });
};
onMounted(() => {
  loadingRoleList();
});

defineExpose({
  openDialog
});
</script>
