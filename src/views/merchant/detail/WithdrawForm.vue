<template>
  <el-dialog title="修改提现方式" v-model="showDialog" width="350px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="提现方式" prop="withdrawWay" class="w300">
        <el-radio-group v-model="formData.withdrawWay">
          <el-radio :value="1">手动提现</el-radio>
          <el-radio :value="2">自动提现</el-radio>
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
import { withdrawWayApi } from '@/api/merchant/detail';
import { successMsg } from '@/utils/message.js';

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const disabled = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  withdrawWay: [{ required: true, message: '请选择提现方式', trigger: 'change' }]
});

const formData = ref({
  withdrawWay: null
});

const openDialog = ({ withdrawWay }) => {
  showDialog.value = true;
  formDataRef.value?.resetFields();
  formData.value.withdrawWay = withdrawWay;
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      withdrawWayApi(formData.value)
        .then(() => {
          successMsg('提现方式修改成功');
          showDialog.value = false;
          emit('reload', { withdrawWay: formData.value.withdrawWay });
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
