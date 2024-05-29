<template>
  <el-dialog title="反馈回复" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
      v-loading="loading">
      <el-form-item label="反馈信息" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6 }" v-model="formData.remark" autosize
          maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click=" showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import { disposeApi } from '@/api/system/feedback';
import { reactive, ref } from 'vue';
import {successMsg} from "@/utils/message.js";

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  remark: [
    { required: true, message: '反馈信息不能为空', trigger: 'blur' }
  ]
})

const formData = ref({
  id: null,
  remark: ""
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value = {id: row.id};
}

const resetForm = () => {
  formData.value = {
    id: null,
    remark: ""
  }
  formDataRef.value?.resetFields();
}

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      disposeApi(formData.value).then(() => {
        successMsg("反馈回复成功");
        showDialog.value = false;
        emit('reload');
      }).finally(() => {
        loading.value = false;
      })
    }
  })
}

defineExpose({
  openDialog
})

</script>
