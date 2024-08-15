<template>
  <el-dialog title="退款审核" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :validate-on-rule-change="false">
      <el-form-item label="订单编号" prop="title">
        {{ formData.orderNo }}
      </el-form-item>
      <el-form-item label="审核状态" prop="state">
        <el-radio-group v-model="formData.state" @change="changeState">
          <el-radio label="通过" :value="1"></el-radio>
          <el-radio label="拒绝" :value="2"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="退款金额" prop="refundAmount">
        <el-input v-model="formData.refundAmount" maxlength="6" @keyup="formData.refundAmount = numberValidator(formData.refundAmount, 2)"/>
      </el-form-item>
      <el-form-item label="审批意见" prop="auditRemark">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="formData.auditRemark" maxlength="100" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">审核</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { auditApi } from '@/api/service/refund';

import { successMsg } from '@/utils/message';
import { numberValidator } from '@/utils/common.js'

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  state: [{ required: true, message: '审核状态不能为空', trigger: 'change' }],
  refundAmount: [{ required: true, message: '退款金额不能为空', trigger: 'blur' }],
  auditRemark: [{ required: true, message: '审批意见不能为空', trigger: 'blur' }]
});

const formData = ref({
  orderNo: null,
  state: 1,
  refundId: null,
  refundAmount: null,
  auditRemark: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value.orderNo = row.orderNo;
  formData.value.refundId = row.id;
  formData.value.refundAmount = row.refundAmount;

};

const changeState = (value) => {
  if (value === 2) {
    formRules.auditRemark = [];
  } else {
    formRules.auditRemark = [{ required: true, message: '审批意见不能为空', trigger: 'blur' }];
  }
}

const resetForm = () => {
  formData.value = {
    orderNo: null,
    state: 1,
    refundId: null,
    refundAmount: null,
    auditRemark: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      auditApi(formData.value)
        .then(() => {
          successMsg('退款审批成功');
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
