<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading">
      <el-form-item label="标签名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="10" />
      </el-form-item>
      <el-form-item label="注册时间段" prop="registerStartDate">
        <div style="width: 400px !important">
          <el-date-picker
            type="date"
            date-format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            v-model="formData.registerStartDate"
            placeholder="开始日期"
            style="width: 190px !important"
            :disabled-date="disabledStartDate"
          ></el-date-picker>
          ~
          <el-date-picker
            type="date"
            date-format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            v-model="formData.registerEndDate"
            placeholder="截止日期(可以为空)"
            style="width: 190px !important"
            :disabled-date="disabledEndDate"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="最近几天有消费" prop="consumeDay">
        <el-input v-model="formData.consumeDay" placeholder="最近几天有消费" maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="最低消费次数" prop="consumeNum">
        <el-input v-model="formData.consumeNum" placeholder="最近几天有消费" maxlength="3" onkeyup="this.value=this.value.replace(/\D/g,'')" />
      </el-form-item>
      <el-form-item label="最低消费金额" prop="consumeAmount">
        <el-input v-model="formData.consumeAmount" placeholder="最近几天有消费" @keyup="formData.consumeAmount = numberValidator(formData.consumeAmount)" />
      </el-form-item>
      <el-form-item label="注册渠道" prop="channel">
        <el-select v-model="formData.channel" clearable>
          <el-option label="PC" value="PC" />
          <el-option label="ANDROID" value="ANDROID" />
          <el-option label="IOS" value="IOS" />
          <el-option label="H5" value="H5" />
          <el-option label="OTHER" value="OTHER" />
        </el-select>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="formData.sex" clearable>
          <el-option label="未知" :value="0" />
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
        </el-select>
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
import { createApi, updateApi } from '@/api/config/memberTag';
import { successMsg } from '@/utils/message.js';
import dayjs from 'dayjs';
import { numberValidator } from '@/utils/common.js';

const loading = ref(false);
const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [
    { required: true, message: '标签名称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 10,
      message: '标签名称2~10个字符',
      trigger: 'blur'
    }
  ],
  registerStartDate: [{ required: true, message: '注册时间不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: '',
  consumeDay: null,
  consumeNum: null,
  consumeAmount: null,
  channel: null,
  registerStartDate: null,
  registerEndDate: null,
  sex: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑标签';
    formData.value = { ...row };
  } else {
    dialogTitle.value = '新增标签';
  }
};

const disabledStartDate = (time) => {
  if (formData.value.registerEndDate) {
    return dayjs(formData.value.registerEndDate, 'YYYY-MM-DD').valueOf() < time.getTime();
  }
  return false;
};

const disabledEndDate = (time) => {
  if (formData.value.registerStartDate) {
    return dayjs(formData.value.registerStartDate, 'YYYY-MM-DD').valueOf() > time.getTime();
  }
  return false;
};

const resetForm = () => {
  formData.value = {
    id: null,
    title: '',
    consumeDay: null,
    consumeNum: null,
    consumeAmount: null,
    channel: null,
    registerStartDate: null,
    registerEndDate: null,
    sex: null
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
            successMsg('修改会员标签成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增会员标签成功');
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
