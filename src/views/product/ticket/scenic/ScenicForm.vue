<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="景区名称" prop="scenicName">
        <el-input v-model="formData.scenicName" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="景区等级" prop="level">
        <el-select v-model="formData.level">
          <el-option label="5A" :value="5" />
          <el-option label="4A" :value="4" />
          <el-option label="3A" :value="3" />
          <el-option label="无" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="营业时间" prop="openTime">
        <el-input v-model="formData.openTime" show-word-limit maxlength="20" />
      </el-form-item>
      <el-form-item label="景区电话" prop="phone">
        <el-input v-model="formData.phone" show-word-limit maxlength="13" />
      </el-form-item>
      <el-form-item label="标签" prop="tagList">
        <el-select v-model="formData.tagList" multiple :multiple-limit="3" filterable>
          <el-option v-for="item in dictList" :label="item.showValue" :value="item.showValue" :key="item.hiddenValue" />
        </el-select>
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
      <el-form-item label="描述信息" prop="depict">
        <el-input v-model="formData.depict" show-word-limit maxlength="50" />
      </el-form-item>
      <el-form-item label="封面图" prop="coverList">
        <UploadImageList v-model:file-list="formData.coverList" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="详细介绍" prop="introduceText">
        <WangEditor v-if="!disabled" v-model:html-value="formData.introduce" v-model:text-value="formData.introduceText"></WangEditor>
        <div v-else v-html="formData.introduce"></div>
      </el-form-item>
    </el-form>
    <div>
      <div class="edit-button-footer" v-if="!disabled">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
      <div class="edit-button-footer" v-else>
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
    <MapContainer ref="mapRef" @reload="setLocation"></MapContainer>
  </div>
</template>

<script setup>
import { createApi, updateApi, selectApi } from '@/api/product/scenic';
import { reactive, ref } from 'vue';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { phoneValidator } from '@/utils/common.js';
import UploadImageList from '@/components/UploadImageList.vue';
import AreaSelect from '@/components/AreaSelect.vue';
import MapContainer from '@/components/MapContainer.vue';
import useDictStore from '@/store/dict.js';

const dictStore = useDictStore();
const dictList = dictStore.getDict('scenic_tag');
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const mapRef = ref();
const disabled = ref(false);

const formRules = reactive({
  scenicName: [{ required: true, message: '景区名称不能为空', trigger: 'blur' }],
  level: [{ required: true, message: '请选择景区等级', trigger: 'change' }],
  phone: [{ required: true, validator: phoneValidator, trigger: 'blur' }],
  areaList: [{ required: true, message: '请选择省市县', trigger: 'change', type: 'array' }],
  detailAddress: [
    { required: true, message: '详细地址不能为空', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  latitude: [{ required: true, message: '请选择经纬度', trigger: 'change' }],
  depict: [
    { required: true, message: '描述信息不能为空', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
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
      formData.value.tag = formData.value.tagList.join(',');
      if (formData.value.id) {
        updateApi(formData.value)
          .then(() => {
            successMsg('景区信息更新成功');
            router.go(-1);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('景区添加成功');
            router.go(-1);
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
    disabled.value = route.fullPath.startsWith('/product/scenic/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        formData.value.coverList = res.data.coverUrl.split(',');
        formData.value.areaList = [res.data.provinceId, res.data.cityId, res.data.countyId];
        formData.value.tagList = res.data.tag.split(',');
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
