<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="点位名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="所属区域" prop="areaCode">
        <PoiAreaSelect v-model="formData.areaCode" :clearable="false"></PoiAreaSelect>
      </el-form-item>
      <el-form-item label="点位类型" prop="typeId">
        <PoiTypeSelect v-model:typeId="formData.typeId" v-model:area-code="formData.areaCode" :clearable="false"></PoiTypeSelect>
      </el-form-item>
      <el-form-item label="经纬度" prop="latitude">
        <el-input v-model="formData.longitude" show-word-limit readonly class="w120" />
        -
        <el-input v-model="formData.latitude" show-word-limit readonly class="w120" />
        &nbsp;
        <el-button type="primary" @click="handleMap">选择</el-button>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input v-model="formData.detailAddress" show-word-limit maxlength="30" />
      </el-form-item>
      <el-form-item label="封面图" prop="coverList">
        <UploadImageList v-model:file-list="formData.coverList" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="详细介绍" prop="introduceText">
        <WangEditor v-model:html-value="formData.introduce" v-model:text-value="formData.introduceText" v-if="!disabled" ></WangEditor>
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
import { createApi, selectApi, updateApi } from '@/api/poi/point';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import PoiAreaSelect from '@/components/PoiAreaSelect.vue';
import PoiTypeSelect from '@/components/PoiTypeSelect.vue';
import MapContainer from '@/components/MapContainer.vue';
import UploadImageList from '@/components/UploadImageList.vue';
import { goBack } from '@/utils/common.js';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const mapRef = ref();
const disabled = ref(false);

const formRules = reactive({
  title: [{ required: true, message: '点位名称不能为空', trigger: 'blur' }],
  areaCode: [{ required: true, message: '所属区域', trigger: 'change' }],
  typeId: [{ required: true, message: '请选择点位类型', trigger: 'change' }],
  latitude: [{ required: true, message: '请选择经纬度', trigger: 'change' }],
  detailAddress: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
  coverList: [{ required: true, message: '请上传封面图', trigger: 'change' }],
  introduceText: [{ required: true, message: '详细介绍不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  title: '',
  typeId: '',
  areaCode: '',
  longitude: null,
  latitude: null,
  detailAddress: null,
  introduceText: '',
  introduce: '',
  coverList: []
});

const handleSave = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('点位信息更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('点位信息添加成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

const handleMap = () => {
  mapRef.value.openDialog(formData.value.longitude, formData.value.latitude);
};

const setLocation = (lng, lat) => {
  formData.value.longitude = lng;
  formData.value.latitude = lat;
};

onMounted(() => {
  const params = route.params;
  if (params.id !== undefined) {
    loading.value = true;
    disabled.value = route.fullPath.startsWith('/poi/point/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        if (res.data.coverUrl) {
          formData.value.coverList = res.data.coverUrl.split(',');
        } else {
          formData.value.coverList = [];
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>
