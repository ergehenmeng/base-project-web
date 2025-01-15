<template>
  <el-dialog title="修改单号" v-model="showDialog" width="400px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="物流公司">
        <el-select v-model="formData.expressCode" filterable class="w240">
          <el-option value="yuantong" label="圆通速递"></el-option>
          <el-option value="shentong" label="申通快递"></el-option>
          <el-option value="jtexpress" label="极兔速递"></el-option>
          <el-option value="zhongtong" label="中通快递"></el-option>
          <el-option value="yunda" label="韵达快递"></el-option>
          <el-option value="youzhengguonei" label="邮政快递"></el-option>
          <el-option value="shunfeng" label="顺丰速运"></el-option>
          <el-option value="jd" label="京东物流"></el-option>
          <el-option value="ems" label="EMS"></el-option>
          <el-option value="debangkuaidi" label="德邦快递"></el-option>
          <el-option value="huitongkuaidi" label="百世快递"></el-option>
          <el-option value="other" label="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物流单号" prop="expressNo">
        <el-input v-model="formData.expressNo" show-word-limit maxlength="20" class="w240"/>
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
import { expressApi } from '@/api/order/item';
import { successMsg } from '@/utils/message';

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  expressCode: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
  expressNo: [{ required: true, message: '物流单号不能为空', trigger: 'blur' }]
});

const formData = ref({
  expressNo: null,
  expressCode: null,
  orderNo: null,
  id: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value = { ...row };
};

const resetForm = () => {
  formData.value = {
    expressNo: null,
    expressCode: null,
    orderNo: null,
    id: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      expressApi(formData.value)
        .then(() => {
          successMsg('单号修改成功');
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
