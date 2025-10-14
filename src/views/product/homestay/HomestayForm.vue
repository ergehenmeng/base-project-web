<template>
  <div class="edit-content">
    <el-divider />
    <el-form :model="formData" ref="formDataRef" :rules="formRules" label-position="right" label-width="auto" v-loading="loading" :disabled="disabled">
      <el-form-item label="民宿名称" prop="title">
        <el-input v-model="formData.title" show-word-limit maxlength="20" />
      </el-form-item>
      <MerchantSelect v-model="formData.merchantId" prop="merchantId" :clearable="false" width="350"></MerchantSelect>
      <el-form-item label="星级" prop="level">
        <el-select v-model="formData.level">
          <el-option label="五星" :value="5" />
          <el-option label="四星" :value="4" />
          <el-option label="三星" :value="3" />
          <el-option label="二星" :value="2" />
          <el-option label="无" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="民宿电话" prop="phone">
        <el-input v-model="formData.phone" show-word-limit maxlength="13" />
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-input-tag v-model="formData.tag" trigger="Space" placeholder="按空格键生成标签" :max="3" maxlength="4" :disabled="disabled"/>
      </el-form-item>
      <el-form-item label="省市县" prop="areaList">
        <AreaSelect v-model="formData.areaList"></AreaSelect>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input type="textarea" v-model="formData.detailAddress"  :autosize="{ minRows: 2, maxRows: 3 }" show-word-limit maxlength="50" />
      </el-form-item>
      <el-form-item label="经纬度" prop="latitude">
        <LocationMap v-model:latitude="formData.latitude" v-model:longitude="formData.longitude"/>
      </el-form-item>
      <el-form-item label="描述信息" prop="intro">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 5 }" v-model="formData.intro" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="封面图" prop="coverUrl">
        <UploadImageList v-model:file-list="formData.coverUrl" :disabled="disabled"></UploadImageList>
      </el-form-item>
      <el-form-item label="特色服务" prop="keyService">
        <div style="width: 800px">
          <el-checkbox-group v-model="formData.keyService">
            <el-checkbox v-for="item in keyServiceList" :key="item.hiddenValue" :label="item.showValue" :value="item.hiddenValue"></el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="入住须知" prop="notesInText">
        <WangEditor v-if="!disabled" v-model:html-value="formData.notesIn" v-model:text-value="formData.notesInText"></WangEditor>
        <div v-else v-html="formData.notesIn" class="html-preview"/>
      </el-form-item>
      <el-form-item label="详细介绍" prop="introduceText">
        <WangEditor v-if="!disabled" v-model:html-value="formData.introduce" v-model:text-value="formData.introduceText"></WangEditor>
        <div v-else v-html="formData.introduce" class="html-preview"/>
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
import { createApi, selectApi, updateApi } from '@/api/product/homestay';
import WangEditor from '@/components/WangEditor.vue';
import { useRoute, useRouter } from 'vue-router';
import { successMsg } from '@/utils/message.js';
import { goBack, phoneValidator } from '@/utils/common.js';
import UploadImageList from '@/components/UploadImageList.vue';
import AreaSelect from '@/components/AreaSelect.vue';
import useDictStore from '@/store/dict.js';
import MerchantSelect from '@/components/MerchantSelect.vue';
import LocationMap from '@/components/LocationMap.vue';

const dictStore = useDictStore();
const keyServiceList = dictStore.getDict('key_service');
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const formDataRef = ref();
const disabled = ref(false);

const formRules = reactive({
  title: [{ required: true, message: '民宿名称不能为空', trigger: 'blur' }],
  merchantId: [{ required: true, message: '请选择商户', trigger: 'change' }],
  level: [{ required: true, message: '请选择民宿星级', trigger: 'change' }],
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
  coverUrl: [{ required: true, message: '请上传封面图', trigger: 'change', type: 'array' }],
  introduceText: [{ required: true, message: '详细介绍不能为空', trigger: 'change' }],
  notesInText: [{ required: true, message: '入住须知不能为空', trigger: 'change' }]
});

const formData = ref({
  id: null,
  homestayName: null,
  level: null,
  merchantId: null,
  openTime: null,
  phone: null,
  tag: [],
  areaList: [],
  detailAddress: null,
  longitude: null,
  latitude: null,
  intro: null,
  coverUrl: [],
  introduceText: null,
  introduce: null,
  notesIn: null,
  notesInText: null,
  keyService: []
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
            successMsg('民宿信息更新成功');
            goBack(router);
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        createApi(formData.value)
          .then(() => {
            successMsg('民宿添加成功');
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
    disabled.value = route.fullPath.startsWith('/product/homestay/detail');
    selectApi(params)
      .then((res) => {
        formData.value = res.data;
        if (res.data.countyId) {
          formData.value.areaList = [res.data.provinceId, res.data.cityId, res.data.countyId];
        } else {
          formData.value.areaList = [res.data.provinceId, res.data.cityId];
        }
        formData.value.introduceText = res.data.introduce;
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
</script>
