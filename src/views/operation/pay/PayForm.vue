<template>
  <el-dialog title="修改配置" v-model="showDialog" width="500px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="支付渠道" prop="channel">
        <span>{{formData.channel}}</span>
      </el-form-item>
      <el-form-item label="微信支付" prop="wechatPay">
        <el-radio-group v-model="formData.wechatPay">
          <el-radio :value="true">开启</el-radio>
          <el-radio :value="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支付宝支付" prop="aliPay">
        <el-radio-group v-model="formData.aliPay">
          <el-radio :value="true">开启</el-radio>
          <el-radio :value="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="formData.remark" maxlength="100" show-word-limit style="width: 350px !important;"/>
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
import { updateApi } from '@/api/config/pay';
import { successMsg } from '@/utils/message.js';

const loading = ref(false);
const emit = defineEmits(['reload']);
const formDataRef = ref();
const showDialog = ref(false);

const formRules = reactive({
  wechatPay: [{ required: true, message: '微信支付不能为空', trigger: 'change' }],
  aliPay: [{ required: true, message: '支付宝支付不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  channel: '',
  wechatPay: false,
  aliPay: false,
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
    channel: '',
    wechatPay: false,
    aliPay: false,
    remark: ''
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
            successMsg('修改配置成功');
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
