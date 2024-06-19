<template>
  <el-dialog title="设置价格" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="日期">
        <div style="width: 350px">
          {{ formData.configDate }}
        </div>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio :value="true">可用</el-radio>
          <el-radio :value="false">不可用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="划线价">
        <el-input v-model="formData.linePrice" placeholder="小于销售价时不显示" show-word-limit maxlength="6" @keyup="formData.linePrice = numberValidator(formData.linePrice)" />
      </el-form-item>
      <el-form-item label="销售价" prop="salePrice">
        <el-input v-model="formData.salePrice" show-word-limit maxlength="6" @keyup="formData.salePrice = numberValidator(formData.salePrice)" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="formData.stock" show-word-limit maxlength="5" onkeyup="this.value=this.value.replace(/\D/g,'')" />
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
import { setDayApi } from '@/api/product/room';
import { reactive, ref } from 'vue';
import { successMsg } from '@/utils/message';
import { numberValidator } from '@/utils/common.js';

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  salePrice: [{ required: true, message: '销售价格不能为空', trigger: 'blur' }],
  stock: [{ required: true, message: '库存不能为空', trigger: 'blur' }]
});

const formData = ref({
  roomId: null,
  configDate: null,
  state: true,
  linePrice: null,
  salePrice: null,
  stock: null
});

const openDialog = (roomId, item) => {
  showDialog.value = true;
  resetForm();
  formData.value.roomId = roomId;
  formData.value.linePrice = item.linePrice;
  formData.value.configDate = item.configDate;
  formData.value.salePrice = item.salePrice;
  formData.value.stock = item.stock;
  if (item.state !== undefined) {
    formData.value.state = item.state;
  }
};

const resetForm = () => {
  formData.value = {
    roomId: null,
    configDate: null,
    state: true,
    linePrice: null,
    salePrice: null,
    stock: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      setDayApi(formData.value)
        .then(() => {
          successMsg('房型价格修改成功');
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
