<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="350px" draggable align-center :close-on-click-modal="false" >
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="父亲" class="w300" v-if="formData.pid !== '10' && formData.parentName">
        <el-input v-model="formData.parentName" disabled/>
      </el-form-item>
      <el-form-item label="姓名" prop="name" class="w300">
        <el-input v-model="formData.name" show-word-limit maxlength="10" />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio :value="false">正常</el-radio>
          <el-radio :value="true">绝户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday" class="w300">
        <div class="w220">
          <el-date-picker type="date" value-format="YYYY-MM-DD" v-model="formData.birthday" style="width: 150px !important"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="备注" prop="remark" class="w300">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="formData.remark" maxlength="100" show-word-limit />
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
import { createApi, updateApi } from '@/api/system/family';
import { successMsg } from '@/utils/message.js';
const emit = defineEmits(['reload']);
const loading = ref(false);
const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);

const formRules = reactive({
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  state: [{ required: true, message: '请选择状态', trigger: 'change' }]
});

const formData = ref({
  id: null,
  parentName: null,
  name: '',
  pid: '',
  birthday: null,
  state: false,
  remark: null
});

const openDialog = (row, isCreate) => {
  showDialog.value = true;
  resetForm();
  if (isCreate) {
    formData.value.pid = row.id;
    formData.value.parentName = row.name;
    dialogTitle.value = '新增';
  } else {
    dialogTitle.value = '编辑';
    formData.value.parentName = null;
    formData.value = {...row};
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    parentName: null,
    name: '',
    pid: '',
    birthday: null,
    state: false,
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
            successMsg('修改成功');
            showDialog.value = false;
            emit('reload', formData.value);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(({data}) => {
            successMsg('新增成功');
            showDialog.value = false;
            formData.value.id = data;
            emit('reload', formData.value);
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
