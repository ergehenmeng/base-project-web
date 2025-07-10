<template>
  <el-dialog v-model="showDialog" width="520" draggable align-center :close-on-click-modal="false">
    <template #header>
      <span>发放奖品<QuestionTip content="注意：备注信息可以填写快递单号等可以记录奖品发放的证据"/></span>
    </template>
    <el-form :model="formData" :rules="formRules" label-position="right" label-width="auto" :validate-on-rule-change="false">
      <el-form-item label="备注信息" class="w450" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4 }" v-model="formData.remark" maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { grantApi } from '@/api/marketing/lottery/index.js'
import { successMsg } from '@/utils/message.js'
import QuestionTip from '@/components/QuestionTip.vue'

const showDialog = ref(false);
const formRules = reactive({
  remark: [{ required: true, message: '备注信息不能为空', trigger: 'blur' }]
});
const emit = defineEmits(['reload']);
const formData = ref({
  id: null,
  remark: null
});

const openDialog = (row) => {
  showDialog.value = true;
  formData.value.id = row.id;
  formData.value.remark = null;
}

const handleSave = () => {
  grantApi(formData.value).then((res) => {
    successMsg('奖品发放成功');
    showDialog.value = false;
    emit('reload');
  })
};

defineExpose({
  openDialog
});

</script>
