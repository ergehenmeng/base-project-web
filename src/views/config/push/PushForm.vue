<template>
  <el-dialog title="编辑推送模板" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="消息标题" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="消息编号" prop="nid">
        <el-input v-model="formData.nid" show-word-limit maxlength="20" disabled />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio label="开启" :value="true"></el-radio>
          <el-radio label="关闭" :value="false"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="formData.content" autosize maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item label="跳转页面" prop="tag">
        <el-select v-model="formData.tag">
          <el-option label="首页" value="index"></el-option>
          <el-option label="商品详情" value="item"></el-option>
          <el-option label="店铺详情" value="store"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注信息" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="formData.remark" autosize maxlength="200" show-word-limit />
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
import { updateApi } from '@/api/config/push';
import { reactive, ref } from 'vue';
import { successMsg } from '@/utils/message';

const loading = ref(false);
const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '消息标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
  tag: [{ required: true, message: '请选择跳转页面', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: '',
  state: true,
  content: '',
  tag: 'index',
  remark: ''
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value = { ...row };
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    state: 1,
    content: '',
    tag: 'index',
    remark: ''
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      updateApi(formData.value)
        .then(() => {
          successMsg('修改推送模板成功');
          showDialog.value = false;
          emit('reload');
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

defineExpose({
  openDialog
});
</script>
