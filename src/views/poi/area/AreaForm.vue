<template>
  <el-dialog :title="dialogTitle" v-model="showDialog" width="550px" draggable align-center :close-on-click-modal="false">
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="区域名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="区域编号" prop="code">
        <el-input v-model="formData.code" show-word-limit maxlength="20" @keyup="formData.code=formData.code.replace(/[^a-zA-Z]/g,'')"/>
      </el-form-item>
      <el-form-item label="经纬度" prop="latitude">
        <el-input v-model="formData.longitude" show-word-limit readonly style="width: 120px !important" />
        -
        <el-input v-model="formData.latitude" show-word-limit readonly style="width: 120px !important" />
        &nbsp;
        <el-button type="primary" @click="handleMap">选择</el-button>
      </el-form-item>
      <el-form-item label="省市县" prop="areaList">
        <AreaSelect v-model="formData.areaList"></AreaSelect>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input v-model="formData.detailAddress" show-word-limit maxlength="30" />
      </el-form-item>
      <el-form-item label="备注信息" prop="remark">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" v-model="formData.remark" maxlength="100" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
    <MapContainer ref="mapRef" @reload="setLocation" :append-to-body="true"></MapContainer>
  </el-dialog>
</template>
<script setup>
import { createApi, updateApi } from '@/api/poi/area';
import { successMsg } from '@/utils/message.js';
import AreaSelect from '@/components/AreaSelect.vue';
import MapContainer from '@/components/MapContainer.vue';

const dialogTitle = ref('');
const formDataRef = ref();
const showDialog = ref(false);
const loading = ref(false);
const disabled = ref(false);
const mapRef = ref();
const emit = defineEmits(['reload']);

const formRules = reactive({
  title: [{ required: true, message: '区域名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '区域编号不能为空', trigger: 'blur' }],
  areaList: [{ required: true, message: '省市县不能为空', trigger: 'change', type: 'array' }],
  detailAddress: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
  latitude: [{ required: true, message: '经纬度不能为空', trigger: 'change' }]
});

const handleMap = () => {
  mapRef.value.openDialog(formData.value.longitude, formData.value.latitude);
};

const setLocation = (lng, lat) => {
  formData.value.longitude = lng;
  formData.value.latitude = lat;
};

const formData = ref({
  id: null,
  title: null,
  code: '',
  areaList: [],
  detailAddress: null,
  longitude: null,
  latitude: null,
  remark: null
});

const openDialog = (row) => {
  showDialog.value = true;
  resetForm();
  if (row.id) {
    dialogTitle.value = '编辑区域';
    formData.value = { ...row };
    formData.value.areaList = [row.provinceId, row.cityId, row.countyId];
  } else {
    dialogTitle.value = '新增区域';
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
            successMsg('区域信息更新成功');
            showDialog.value = false;
            emit('reload');
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('区域信息添加成功');
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
