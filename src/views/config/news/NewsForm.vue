<template>
  <el-dialog
    :title="dialogTitle"
    v-model="showDialog"
    width="550px"
    draggable
    align-center
    :close-on-click-modal="false"
  >
    <el-form
      :model="formData"
      ref="formDataRef"
      :rules="formRules"
      label-position="right"
      label-width="auto"
      v-loading="loading"
    >
      <el-form-item label="分类标题" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="10" />
      </el-form-item>
      <el-form-item label="资讯编码" prop="code">
        <el-input
          v-model="formData.code"
          show-word-limit
          maxlength="20"
          :disabled="formData.id !== null"
        />
      </el-form-item>
      <el-form-item label="包含标题" prop="includeTitle">
        <el-radio-group v-model="formData.includeTitle" disabled>
          <el-radio label="是" :value="true"></el-radio>
          <el-radio label="否" :value="false"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="包含描述信息" prop="includeDepict">
        <el-radio-group v-model="formData.includeDepict">
          <el-radio label="是" :value="true"></el-radio>
          <el-radio label="否" :value="false"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="包含图集" prop="includeImage">
        <el-radio-group v-model="formData.includeImage">
          <el-radio label="是" :value="true"></el-radio>
          <el-radio label="否" :value="false"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="包含详细信息" prop="includeContent">
        <el-radio-group v-model="formData.includeContent" disabled>
          <el-radio label="是" :value="true"></el-radio>
          <el-radio label="否" :value="false"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="包含视频" prop="includeVideo">
        <el-radio-group v-model="formData.includeVideo">
          <el-radio label="是" :value="true"></el-radio>
          <el-radio label="否" :value="false"></el-radio>
        </el-radio-group>
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
import { createApi, updateApi } from '@/api/config/news';
import { reactive, ref } from 'vue';
import { successMsg } from '@/utils/message';

const loading = ref(false);
const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '分类标题不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '资讯编码不能为空', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  title: '',
  code: '',
  includeTitle: true,
  includeDepict: false,
  includeImage: false,
  includeContent: true,
  includeVideo: false
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑轮播';
    formData.value = { ...row };
    formData.value.showTime = [row.startTime, row.endTime];
  } else {
    dialogTitle.value = '新增轮播';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    code: '',
    includeTitle: true,
    includeDepict: false,
    includeImage: false,
    includeContent: false,
    includeVideo: false
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
            successMsg('修改资讯配置成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增资讯配置成功');
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
