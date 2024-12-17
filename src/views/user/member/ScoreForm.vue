<template>
  <el-dialog title="更新积分" v-model="showDialog" width="420px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="积分类型" prop="scoreType" style="width: 350px">
        <el-select v-model="formData.scoreType" >
          <el-option label="签到积分" value="1" />
          <el-option label="抽奖积分" value="2" />
          <el-option label="支付积分" value="3" />
          <el-option label="支付取消" value="4" />
          <el-option label="退款" value="5" />
          <el-option label="系统扣除" value="6" />
          <el-option label="系统奖励" value="7" />
        </el-select>
      </el-form-item>
      <el-form-item label="积分" prop="score" style="width: 350px">
        <el-input v-model="formData.score" maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="备注" prop="remark" style="width: 350px">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="formData.remark" maxlength="50" show-word-limit />
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
import { updateScoreApi } from '@/api/user/member';
import { successMsg } from '@/utils/message.js';

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  scoreType: [{ required: true, message: '请选择积分类型', trigger: 'change' }],
  score: [{ required: true, message: '请输入积分数量', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  scoreType: null,
  score: null,
  remark: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value = { ...row };
};

const resetForm = () => {
  formData.value = {
    id: null,
    scoreType: null,
    score: null,
    remark: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateScoreApi(formData.value)
          .then(() => {
            successMsg('修改积分成功');
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
