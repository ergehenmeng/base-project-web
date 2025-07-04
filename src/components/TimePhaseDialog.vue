<template>
  <el-dialog title="设置价格" v-model="showDialog" width="380px" draggable align-center :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto">
      <el-form-item label="日期"> {{ formData.startTime }} ~ {{ formData.endTime }}</el-form-item>
      <el-form-item label="价格" prop="price" class="w300">
        <el-input v-model="formData.price" maxlength="6" @keyup="formData.price = numberValidator(formData.price)" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { numberValidator } from '@/utils/common.js';

const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload', 'cancel']);

const formRules = reactive({
  price: [{ required: true, message: '价格不能为空', trigger: 'blur' }]
});

const formData = ref({
  startTime: null,
  endTime: null,
  price: null
});

const openDialog = (startTime, endTime) => {
  showDialog.value = true;
  resetForm();
  formData.value.startTime = startTime;
  formData.value.endTime = endTime;
};

const resetForm = () => {
  formData.value = {
    startTime: null,
    endTime: null,
    price: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      showDialog.value = false;
      emit('reload', formData.value.price);
    }
  });
};

const handleCancel = () => {
  showDialog.value = false;
  emit('cancel');
};

defineExpose({
  openDialog
});
</script>
