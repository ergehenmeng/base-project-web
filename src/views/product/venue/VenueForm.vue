<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="场馆名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="场馆类型" prop="venueType">
        <el-select v-model="formData.venueType">
          <el-option label="篮球馆" :value="1" />
          <el-option label="网球馆" :value="2" />
          <el-option label="羽毛球馆" :value="3" />
          <el-option label="乒乓球馆" :value="4" />
          <el-option label="游泳馆" :value="5" />
          <el-option label="健身馆" :value="6" />
          <el-option label="瑜伽馆" :value="7" />
          <el-option label="保龄馆" :value="8" />
          <el-option label="足球馆" :value="9" />
          <el-option label="排球馆" :value="10" />
          <el-option label="田径馆" :value="11" />
          <el-option label="综合馆" :value="12" />
          <el-option label="跆拳道馆" :value="13" />
        </el-select>
      </el-form-item>
      <el-form-item label="营业时间" prop="openTime">
        <el-input v-model="formData.openTime" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="客服电话" prop="telephone">
        <el-input v-model="formData.telephone" show-word-limit maxlength="12" />
      </el-form-item>
      <el-form-item label="省市县" prop="areaList">
        <AreaSelect v-model="formData.areaList"></AreaSelect>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input v-model="formData.detailAddress" show-word-limit maxlength="100" />
      </el-form-item>
      <el-form-item label="经纬度" prop="latitude">
        <el-input v-model="formData.longitude" show-word-limit readonly class="w120" />
        -
        <el-input v-model="formData.latitude" show-word-limit readonly class="w120" />
        &nbsp;
        <el-button type="primary" @click="handleMap">选择</el-button>
      </el-form-item>
      <el-form-item label="封面图" prop="coverList">
        <UploadImageList v-model:file-list="formData.coverList" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="场馆介绍" prop="introduceText">
        <WangEditor v-if="!disabled" v-model:html-value="formData.introduce" v-model:text-value="formData.introduceText"></WangEditor>
        <div v-else v-html="formData.introduce"></div>
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
  <MapContainer ref="mapRef" @reload="setLocation"></MapContainer>
</template>

<script setup>
import { createApi, selectApi, updateApi } from '@/api/product/venue';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import AreaSelect from '@/components/AreaSelect.vue';
import UploadImageList from '@/components/UploadImageList.vue';
import { goBack, phoneValidator } from '@/utils/common.js';
import MapContainer from '@/components/MapContainer.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);
const mapRef = ref();

const formRules = reactive({
  title: [{ required: true, message: '景区名称不能为空', trigger: 'blur' }],
  telephone: [{ required: true, validator: phoneValidator, trigger: 'blur' }],
  areaList: [{ required: true, message: '请选择省市县', trigger: 'change', type: 'array' }],
  venueType: [{ required: true, message: '请选择场馆类型', trigger: 'change' }],
  detailAddress: [
    { required: true, message: '详细地址不能为空', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  latitude: [{ required: true, message: '请选择经纬度', trigger: 'change' }],
  openTime: [{ required: true, message: '营业时间不能为空', trigger: 'blur' }],
  coverList: [{ required: true, message: '请上传封面图', trigger: 'change', type: 'array' }],
  introduceText: [{ required: true, message: '详细介绍不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  scenicName: null,
  level: 0,
  openTime: null,
  phone: null,
  tagList: [],
  areaList: [],
  detailAddress: null,
  longitude: null,
  latitude: null,
  depict: null,
  coverList: [],
  introduceText: null,
  introduce: null
});

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
            successMsg('场馆信息更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('场馆添加成功');
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
    disabled.value = route.fullPath.startsWith('/product/venue/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        formData.value.areaList = [res.data.provinceId, res.data.cityId, res.data.countyId];
        if (res.data.coverUrl) {
          formData.value.coverList = res.data.coverUrl.split(',');
        } else {
          formData.value.coverList = [];
        }
        formData.value.introduceText = res.data.introduce;
      })
      .finally(() => {
        loading.value = false;
      });
  }
});

const handleMap = () => {
  mapRef.value.openDialog(formData.value.longitude, formData.value.latitude);
};

const setLocation = (lng, lat) => {
  formData.value.longitude = lng;
  formData.value.latitude = lat;
};
</script>
