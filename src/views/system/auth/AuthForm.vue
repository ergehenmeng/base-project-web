<template>
  <el-dialog v-model="showDialog" width="520px" draggable align-center :close-on-click-modal="false">
    <template #header>
      <span>{{ dialogTitle }}<QuestionTip content="注意：相关业务代码需要开发人员额外开发"/></span>
    </template>
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="单位名称" prop="title" class="w450">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="签名方式" prop="signType" class="w450">
        <el-select v-model="formData.signType" :disabled="formData.id !== null">
          <el-option label="MD5" value="MD5" />
          <el-option label="RSA" value="RSA" />
        </el-select>
      </el-form-item>
      <el-form-item label="过期时间" prop="expireDate" class="w450">
        <el-date-picker v-model="formData.expireDate" type="date" value-format="YYYY-MM-DD" placeholder="默认有效期一年" :disabled-date="disableBeforeDate" />
      </el-form-item>
      <el-form-item label="备注" prop="remark" class="w450">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 5 }" v-model="formData.remark" maxlength="200" show-word-limit />
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
import { createApi, updateApi } from '@/api/system/auth';
import { successMsg } from '@/utils/message.js';
import { disableBeforeDate } from '@/utils/common.js';
import QuestionTip from '@/components/QuestionTip.vue'

const loading = ref(false);
const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }, { min: 2, max: 20, message: '单位名称长度2~20位', trigger: 'blur' }],
  signType: [{ required: true, message: '签名方式不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: '',
  signType: 'MD5',
  expireDate: null,
  remark: ''
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑授权';
    formData.value = { ...row };
  } else {
    dialogTitle.value = '新增授权';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    signType: 'MD5',
    expireDate: null,
    remark: ''
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
            successMsg('修改授权信息成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增授权信息成功');
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

defineExpose({
  openDialog
});
</script>
