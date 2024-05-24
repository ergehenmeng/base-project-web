<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="500px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
      v-loading="loading">
      <el-form-item label="显示值" prop="showValue">
        <el-input v-model="formData.showValue" show-word-limit maxlength="10" />
      </el-form-item>
      <el-form-item label="隐藏值" prop="hiddenValue">
        <el-input v-model="formData.hiddenValue" show-word-limit maxlength="3" type="number"/>
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
import { createItemApi, updateItemApi } from '@/api/system/dict';
import { reactive, ref } from 'vue';

const loading = ref(false);
const dialogTitle = ref("");
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  showValue: [
    { required: true, message: '显示值不能为空', trigger: 'blur' }
  ],
  hiddenValue: [
    { required: true, message: '隐藏值不能为空', trigger: 'blur' }
  ]
})

const formData = ref({
  id: null,
  showValue: "",
  hiddenValue: ""
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = "编辑子项";
    formData.value = Object.assign({}, row);
  } else {
    dialogTitle.value = "新增子项";
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    showValue: "",
    hiddenValue: ""
  }
  formDataRef.value?.resetFields();
}

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateItemApi(formData.value).then(res => {
          ElMessage.success("修改子项成功");
          showDialog.value = false;
          emit('reload');
        }).finally(() => {
          loading.value = false;
        })
      } else {
        createItemApi(formData.value).then(res => {
          ElMessage.success("新增子项成功");
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

<style lang="scss" scoped></style>
