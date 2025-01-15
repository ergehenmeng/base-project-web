<template>
  <el-dialog title="改价" v-model="showDialog" width="350px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="商品信息:">
        <span>{{ formData.title }} <span v-if="formData.skuTitle"> - {{ formData.skuTitle }}</span></span>
      </el-form-item>
      <el-form-item label="原价格:">
        <span>{{ formData.salePrice }}</span>
      </el-form-item>
      <el-form-item label="新价格:" prop="price">
        <el-input v-model="formData.price" show-word-limit maxlength="6" class="w180" @keyup="formData.price = numberValidator(formData.price)" />
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
import { adjustApi } from '@/api/order/item';
import { successMsg } from '@/utils/message';
import { numberValidator } from '@/utils/common.js';

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  price: [{ required: true, message: '新价格不能为空', trigger: 'blur' }]
});

const formData = ref({
  title: null,
  skuTitle: null,
  orderNo: null,
  orderId: null,
  salePrice: null,
  price: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value = { ...row };
};

const resetForm = () => {
  formData.value = {
    title: null,
    skuTitle: null,
    orderNo: null,
    orderId: null,
    salePrice: null,
    price: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      adjustApi(formData.value)
        .then(() => {
          successMsg('改价成功');
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
