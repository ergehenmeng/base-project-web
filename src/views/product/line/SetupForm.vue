<template>
  <el-dialog title="批量设置" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto"
             v-loading="loading">
      <el-form-item label="设置日期" prop="configDate">
        <div style="width: 350px;">
          <el-date-picker type="daterange" value-format="YYYY-MM-DD" v-model="formData.configDate" style="width: 350px;"></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="周期" prop="week">
        <el-checkbox-group v-model="formData.week">
          <el-checkbox label="星期一" :value="1"></el-checkbox>
          <el-checkbox label="星期二" :value="2"></el-checkbox>
          <el-checkbox label="星期三" :value="3"></el-checkbox>
          <el-checkbox label="星期四" :value="4"></el-checkbox>
          <el-checkbox label="星期五" :value="5"></el-checkbox>
          <el-checkbox label="星期六" :value="6"></el-checkbox>
          <el-checkbox label="星期日" :value="7"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" prop="state" >
        <el-radio-group v-model="formData.state">
          <el-radio :value="true">可用</el-radio>
          <el-radio :value="false">不可用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="划线价" >
        <el-input v-model="formData.linePrice" placeholder="小于销售价时不显示" show-word-limit maxlength="6" @keyup="formData.linePrice=numberValidator(formData.linePrice);"/>
      </el-form-item>
      <el-form-item label="销售价" prop="salePrice">
        <el-input v-model="formData.salePrice" show-word-limit maxlength="6" @keyup="formData.salePrice=numberValidator(formData.salePrice);" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="formData.stock" show-word-limit maxlength="5" onkeyup="this.value=this.value.replace(/\D/g,'')" />
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
import { setupApi} from '@/api/product/line';
import {reactive, ref} from 'vue';
import {successMsg} from '@/utils/message';
import {numberValidator} from "@/utils/common.js";

const loading = ref(false);
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  configDate: [
    { required: true, message: '设置日期不能为空', trigger: 'blur', type: 'array' }
  ],
  week: [
    { required: true, message: '请选择客户端', trigger: 'blur', type: 'array' }
  ],
  salePrice: [
    { required: true, message: '销售价格不能为空', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '库存不能为空', trigger: 'blur' }
  ]
})

const formData = ref({
  lineId: null,
  configDate: [],
  week: [],
  state: true,
  linePrice: null,
  salePrice: null,
  stock: null
});

const openDialog = (lineId) => {
  showDialog.value = true;
  resetForm();
  formData.value.lineId = lineId;
}

const resetForm = () => {
  formData.value = {
    lineId: null,
    configDate: [],
    week: [],
    state: true,
    linePrice: null,
    salePrice: null,
    stock: null
  }
  formDataRef.value?.resetFields();
}

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      formData.value.startDate = formData.value.configDate[0];
      formData.value.endDate = formData.value.configDate[1];
      loading.value = true;
      setupApi(formData.value).then(() => {
        successMsg("线路价格配置成功");
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
