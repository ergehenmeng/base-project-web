<template>
  <el-dialog v-model="showDialog" width="320px" draggable align-center :close-on-click-modal="false">
    <template #header>
      <span>调整费率<QuestionTip content="提示：商户所售商品交易成功后平台收取的服务费(退款不收费)"/></span>
    </template>
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="平台服务费(%)" prop="platformServiceRate" class="w250">
        <el-input v-model="formData.platformServiceRate" @keyup="formData.platformServiceRate = numberValidator(formData.platformServiceRate)" maxlength="4" />
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
import { adjustRateApi } from '@/api/user/merchant';
import { successMsg } from '@/utils/message';
import { numberValidator } from '@/utils/common.js';
import QuestionTip from '@/components/QuestionTip.vue';

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  platformServiceRate: [
    { required: true, message: '平台服务费不能为空', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        const number = parseFloat(value);
        if (number < 0 || number > 10) {
          callback(new Error('费率应在0%~10%之间'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

const formData = ref({
  id: null,
  platformServiceRate: 0
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value = { ...row };
};

const resetForm = () => {
  formData.value = {
    id: null,
    platformServiceRate: 0
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      adjustRateApi(formData.value)
        .then(() => {
          successMsg('平台费率调整成功');
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
