<template>
  <el-dialog
    :title="dialogTitle"
    v-model="showDialog"
    width="550px"
    draggable
    align-center
    :close-on-click-modal="false"
  >
    <el-form
      :model="formData"
      ref="formDataRef"
      :rules="formRules"
      label-position="right"
      label-width="auto"
      v-loading="loading"
    >
      <el-form-item label="收货人昵称" prop="nickName">
        <el-input v-model="formData.nickName" show-word-limit maxlength="10" />
      </el-form-item>
      <el-form-item label="收货人手机号" prop="mobile">
        <el-input v-model="formData.mobile" show-word-limit maxlength="12" />
      </el-form-item>
      <el-form-item label="省市县" prop="areaList">
        <AreaSelect v-model="formData.areaList"></AreaSelect>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input v-model="formData.detailAddress" show-word-limit maxlength="100" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="formData.remark"
          autosize
          maxlength="100"
          show-word-limit
        />
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
import { createApi, selectApi, updateApi } from '@/api/product/address';
import { reactive, ref } from 'vue';
import { successMsg } from '@/utils/message.js';
import AreaSelect from '@/components/AreaSelect.vue';

const loading = ref(false);
const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);

const emit = defineEmits(['reload']);

const formRules = reactive({
  nickName: [{ required: true, message: '收货人昵称不能为空', trigger: 'blur' }],
  mobile: [
    { required: true, message: '收货人手机号不能为空', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  areaList: [{ required: true, message: '省市县不能为空', trigger: 'change', type: 'array' }],
  detailAddress: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }]
});

const formData = ref({
  id: null,
  nickName: null,
  mobile: null,
  areaList: [],
  detailAddress: null,
  remark: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑收货地址';
    selectApi({ id: row.id }).then((res) => {
      formData.value = res.data;
      formData.value.areaList = [res.data.provinceId, res.data.cityId, res.data.countyId];
    });
  } else {
    dialogTitle.value = '新增收货地址';
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    nickName: null,
    mobile: null,
    areaList: [],
    detailAddress: null,
    remark: null
  };
  formDataRef.value?.resetFields();
};

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.value.provinceId = formData.value.areaList[0];
      formData.value.cityId = formData.value.areaList[1];
      formData.value.countyId = formData.value.areaList[2];
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('修改收货地址成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('新增收货地址成功');
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
