<template>
  <el-dialog title="发送站内信" v-model="showDialog" width="600"  draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-width="auto" label-position="right">
      <el-form-item label="奖品名称" prop="prizeName">
        <el-input v-model="formData.prizeName" show-word-limit maxlength="10" />
      </el-form-item>
      <el-form-item label="奖品类型" prop="prizeType">
        <el-select v-model="formData.prizeType">
          <el-option label="谢谢参与" :value="0" />
          <el-option label="优惠券" :value="1" />
          <el-option label="积分" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="单次中奖发放数量" prop="num">
        <el-input v-model="formData.num" show-word-limit maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="奖品总数量" prop="totalNum">
        <el-input v-model="formData.totalNum" show-word-limit maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')"/>
      </el-form-item>
      <el-form-item label="奖品图片" prop="coverUrl">
        <UploadImage v-model:model-value="formData.coverUrl"></UploadImage>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">新增奖品</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';
import UploadImage from "@/components/UploadImage.vue";

const emit = defineEmits(['reload']);

const formRules = reactive({
  prizeName: [{ required: true, message: '奖品名称不能为空', trigger: 'blur' }],
  prizeType: [{ required: true, message: '奖品类型不能为空', trigger: 'change' }],
  num: [{ required: true, message: '单次中奖发放数量不能为空', trigger: 'blur' }],
  totalNum: [{ required: true, message: '奖品总数量不能为空', trigger: 'blur' }],
  coverUrl: [{ required: true, message: '奖品图片不能为空', trigger: 'change' }],
});

const formData = ref({
  prizeName: null,
  prizeType: 0,
  num: 1,
  totalNum: null,
  coverUrl: null
});

const formDataRef = ref();
const showDialog = ref(false);

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  formData.value = { ...row };
};

const resetForm = () => {
  formData.value = {
    prizeName: null,
    prizeType: 0,
    num: 1,
    totalNum: null,
    coverUrl: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      showDialog.value = false;
      emit('reload', formData.value);
    }
  });
};

defineExpose({
  openDialog
});
</script>
