<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="商家名称" prop="merchantName">
        <el-input v-model="formData.merchantName" show-word-limit maxlength="30" />
      </el-form-item>
      <el-form-item label="联系人电话" prop="mobile">
        <el-input v-model="formData.mobile" show-word-limit maxlength="11" />
      </el-form-item>
      <el-form-item label="商家类型" prop="type">
        <el-checkbox-group v-model="formData.typeList">
          <el-checkbox :value="1" label="景区"></el-checkbox>
          <el-checkbox :value="2" label="商户"></el-checkbox>
          <el-checkbox :value="4" label="餐饮"></el-checkbox>
          <el-checkbox :value="8" label="零售"></el-checkbox>
          <el-checkbox :value="16" label="线路"></el-checkbox>
          <el-checkbox :value="32" label="场馆"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="企业类型" prop="enterpriseType">
        <el-radio-group v-model="formData.enterpriseType">
          <el-radio :value="1" label="个人"></el-radio>
          <el-radio :value="2" label="企业"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="社会统一信用代码" prop="creditCode">
        <el-input v-model="formData.creditCode" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="营业执照图片" prop="licenseUrlList">
        <UploadImageList v-model:file-list="formData.licenseUrlList" :limit="4" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="法人姓名" prop="legalName">
        <el-input v-model="formData.legalName" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="法人身份证" prop="legalIdCard">
        <el-input v-model="formData.legalIdCard" show-word-limit maxlength="18" />
      </el-form-item>
      <el-form-item label="法人身份证图片" prop="cardUrlList">
        <UploadImageList v-model:file-list="formData.cardUrlList" :limit="2" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="省市县" prop="areaList">
        <AreaSelect v-model="formData.areaList"></AreaSelect>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input v-model="formData.detailAddress" show-word-limit maxlength="100" />
      </el-form-item>
    </el-form>
    <div>
      <div class="edit-button-footer" v-if="!disabled">
        <el-button @click="goBack($router)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
      <div class="edit-button-footer" v-else>
        <el-button @click="goBack($router)">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/user/merchant';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import UploadImageList from '@/components/UploadImageList.vue';
import AreaSelect from '@/components/AreaSelect.vue';
import { goBack } from '@/utils/common.js';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);

const formRules = reactive({
  merchantName: [{ required: true, message: '商户名称不能为空', trigger: 'blur' }],
  mobile: [{ required: true, message: '联系人电话不能为空', trigger: 'blur' }],
  typeList: [{ required: true, message: '请选择商家类型', trigger: 'change', type: 'array' }],
  creditCode: [{ required: true, message: '社会统一信用代码不能为空', trigger: 'blur' }],
  licenseUrlList: [{ required: true, message: '请上传营业执照图片', trigger: 'change', type: 'array' }],
  legalName: [{ required: true, message: '法人姓名不能为空', trigger: 'blur' }],
  legalIdCard: [{ required: true, message: '法人身份证不能为空', trigger: 'blur' }],
  cardUrlList: [{ required: true, message: '请上传法人身份证图片', trigger: 'change', type: 'array' }],
  areaList: [{ required: true, message: '请选择省市县', trigger: 'change', type: 'array' }],
  detailAddress: [
    { required: true, message: '详细地址不能为空', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ]
});

const formData = ref({
  id: null,
  merchantName: null,
  mobile: null,
  typeList: [],
  enterpriseType: 1,
  creditCode: null,
  areaList: [],
  licenseUrlList: [],
  cardUrlList: [],
  legalName: null,
  legalIdCard: null,
  detailAddress: null
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      formData.value.provinceId = formData.value.areaList[0];
      formData.value.cityId = formData.value.areaList[1];
      formData.value.countyId = formData.value.areaList[2];
      formData.value.businessLicenseUrl = formData.value.licenseUrlList.join(',');
      formData.value.legalUrl = formData.value.cardUrlList.join(',');
      formData.value.type = formData.value.typeList.reduce((pre, cur) => pre + cur, 0);
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('商户信息更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('商户添加成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

onMounted(() => {
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    // 详情页面进来不可点击
    disabled.value = route.fullPath.startsWith('/user/merchant/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        if (res.data.legalUrl) {
          formData.value.cardUrlList = res.data.legalUrl.split(',');
        } else {
          formData.value.cardUrlList = [];
        }
        if (res.data.businessLicenseUrl) {
          formData.value.licenseUrlList = res.data.businessLicenseUrl.split(',');
        } else {
          formData.value.licenseUrlList = [];
        }
        formData.value.areaList = [res.data.provinceId, res.data.cityId, res.data.countyId];
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>
